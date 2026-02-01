const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });
const express = require('express');
const cors = require('cors');
const { Configuration, PlaidApi, PlaidEnvironments } = require('plaid');

const app = express();
app.use(cors());
app.use(express.json({ limit: '10mb' }));
const { analyzeTransactions } = require('./llm_service');

const PLAID_SECRET = process.env.PLAID_SECRET || process.env.PLAID_SANDBOX_SECRET;

const config = new Configuration({
  basePath: PlaidEnvironments[process.env.PLAID_ENV || 'sandbox'],
  baseOptions: {
    headers: {
      'PLAID-CLIENT-ID': process.env.PLAID_CLIENT_ID,
      'PLAID-SECRET': PLAID_SECRET,
    },
  },
});

const plaidClient = new PlaidApi(config);

// Changed to array to support multiple accounts
let ACCESS_TOKENS = [];

app.post('/create_link_token', async (req, res) => {
  try {
    const response = await plaidClient.linkTokenCreate({
      user: { client_user_id: 'credzen-user' },
      client_name: 'CredZen',
      products: ['transactions'],
      country_codes: ['US'],
      language: 'en',
    });
    res.json(response.data);
  } catch (err) {
    console.error('create_link_token error', err);
    res.status(500).json({ error: err?.response?.data || err.message || String(err) });
  }
});

app.post('/exchange_public_token', async (req, res) => {
  try {
    const { public_token } = req.body;
    if (!public_token) return res.status(400).json({ error: 'public_token is required' });
    const response = await plaidClient.itemPublicTokenExchange({ public_token });

    // Check if token already exists
    const accessToken = response.data.access_token;
    if (!ACCESS_TOKENS.includes(accessToken)) {
      ACCESS_TOKENS.push(accessToken);
    }

    res.json({ success: true, count: ACCESS_TOKENS.length });
  } catch (err) {
    console.error('exchange_public_token error', err);
    res.status(500).json({ error: err?.response?.data || err.message || String(err) });
  }
});

app.get('/transactions', async (req, res) => {
  try {
    if (ACCESS_TOKENS.length === 0) return res.status(404).json({ error: 'No access tokens. Connect a bank first.' });

    let allTransactions = [];

    // Helper: normalize/label category
    function normalizeCategory(rawCategory, merchant) {
      const rc = (rawCategory || '').toString();
      const rcUpper = rc.toUpperCase();
      if (/FOOD|RESTAURANT|DINING|MEAL|FOOD_AND_DRINK/.test(rcUpper) || /zomato|swiggy|restaurant|cafe/i.test(merchant)) {
        return { raw: rawCategory || 'FOOD_AND_DRINK', label: 'Food & Drink', key: 'FOOD_AND_DRINK' };
      }
      if (/TRAVEL|FLIGHT|HOTEL|TRANSPORT/.test(rcUpper) || /uber|ola|air|flight|hotel|united|delta/i.test(merchant)) {
        return { raw: rawCategory || 'TRAVEL', label: 'Travel', key: 'TRAVEL' };
      }
      if (/INCOME/.test(rcUpper)) {
        return { raw: rawCategory || 'INCOME', label: 'Income', key: 'INCOME' };
      }
      if (/FUEL|GAS|PETROL/.test(rcUpper) || /petrol|shell|bharat/i.test(merchant)) {
        return { raw: rawCategory || 'FUEL', label: 'Fuel', key: 'FUEL' };
      }
      if (/SHOP|STORE|PURCHASE|RETAIL/.test(rcUpper) || /amazon|flipkart|myntra|store/i.test(merchant)) {
        return { raw: rawCategory || 'SHOPPING', label: 'Shopping', key: 'SHOPPING' };
      }
      if (/GROC|GROCERY/.test(rcUpper) || /supermarket|grocery|kirana/i.test(merchant)) {
        return { raw: rawCategory || 'GROCERIES', label: 'Groceries', key: 'GROCERIES' };
      }
      return { raw: rawCategory || 'OTHER', label: (rawCategory || 'Other').toString().replaceAll('_', ' ').toLowerCase(), key: rawCategory || 'OTHER' };
    }

    // Iterate over all tokens
    for (const token of ACCESS_TOKENS) {
      // 1️⃣ Get accounts (cards)
      const accountsRes = await plaidClient.accountsGet({ access_token: token });

      // 1.5️⃣ Get Institution Name (Bank)
      let institutionName = '';
      try {
        const itemRes = await plaidClient.itemGet({ access_token: token });
        const instId = itemRes.data.item.institution_id;
        if (instId) {
          const instRes = await plaidClient.institutionsGetById({ institution_id: instId, country_codes: ['US'] });
          institutionName = instRes.data.institution.name;
        }
      } catch (err) {
        console.error('Failed to get institution', err.message);
      }

      // 2️⃣ Pick only credit accounts
      const creditCards = (accountsRes.data.accounts || []).filter(acc => acc.type === 'credit');
      const allowedAccountIds = creditCards.slice(0, 3).map(a => a.account_id);

      if (allowedAccountIds.length === 0) continue;

      // 3️⃣ Get transactions
      const txRes = await plaidClient.transactionsGet({
        access_token: token,
        start_date: '2025-01-01',
        end_date: '2026-01-31',
        options: { count: 500, offset: 0 },
      });

      // 4️⃣ Map account_id -> card name
      const accountMap = {};
      creditCards.forEach(acc => {
        const prefix = institutionName ? `${institutionName} - ` : '';
        accountMap[acc.account_id] = `${prefix}${acc.name} (${acc.mask || 'xxxx'})`;
      });

      // 5️⃣ Filter + format transactions
      const formatted = (txRes.data.transactions || [])
        .filter(tx => allowedAccountIds.includes(tx.account_id))
        .map(tx => {
          const merchant = tx.merchant_name || tx.name || '';
          const rawCat = tx.personal_finance_category?.primary || tx.category?.[0] || '';
          const norm = normalizeCategory(rawCat, merchant);
          return {
            date: tx.date,
            merchant,
            amount: tx.amount,
            category: norm.raw || 'other',
            category_label: norm.label,
            category_key: norm.key,
            card: accountMap[tx.account_id] || 'Unknown Card',
          };
        });

      allTransactions = [...allTransactions, ...formatted];
    }

    // Sort combined transactions by date
    allTransactions.sort((a, b) => new Date(b.date) - new Date(a.date));

    res.json(allTransactions);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch transactions' });
  }
});




app.post('/api/smart-pick/analyze', async (req, res) => {
  try {
    const { transactions } = req.body;
    if (!transactions || !Array.isArray(transactions)) {
      return res.status(400).json({ error: 'Invalid transactions data' });
    }

    // In a real app, we might want to validate or limit the transactions sent to the LLM
    const { cards } = req.body;
    const analysis = await analyzeTransactions(transactions, cards);
    res.json(analysis);
  } catch (err) {
    console.error('LLM Analysis Error:', err);
    res.status(500).json({ error: 'Failed to analyze transactions' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Backend running on ${PORT}`));
