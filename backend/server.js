const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });
const express = require('express');
const cors = require('cors');
const { Configuration, PlaidApi, PlaidEnvironments } = require('plaid');

const app = express();
app.use(cors());
app.use(express.json());

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

let ACCESS_TOKEN = null;

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
    ACCESS_TOKEN = response.data.access_token;
    res.json({ success: true });
  } catch (err) {
    console.error('exchange_public_token error', err);
    res.status(500).json({ error: err?.response?.data || err.message || String(err) });
  }
});

app.get('/transactions', async (req, res) => {
  try {
    if (!ACCESS_TOKEN) return res.status(404).json({ error: 'No access token. Connect a bank first.' });

    // 1️⃣ Get accounts (cards)
    const accountsRes = await plaidClient.accountsGet({ access_token: ACCESS_TOKEN });

    // 2️⃣ Pick only credit accounts
    const creditCards = (accountsRes.data.accounts || []).filter(acc => acc.type === 'credit');

    // (OPTIONAL) Limit to only 3 cards
    const allowedAccountIds = creditCards.slice(0, 3).map(a => a.account_id);

    // 3️⃣ Get transactions for date range requested
    const txRes = await plaidClient.transactionsGet({
      access_token: ACCESS_TOKEN,
      start_date: '2025-01-01',
      end_date: '2026-01-31',
      options: { count: 500, offset: 0 },
    });

    // 4️⃣ Map account_id -> card name
    const accountMap = {};
    creditCards.forEach(acc => {
      accountMap[acc.account_id] = acc.name;
    });

    // helper: normalize/label category
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

    // 5️⃣ Filter + format transactions (only from allowed cards)
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

    res.json(formatted);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch transactions' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Backend running on ${PORT}`));
