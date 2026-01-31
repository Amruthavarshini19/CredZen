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

    const response = await plaidClient.transactionsGet({
      access_token: ACCESS_TOKEN,
      start_date: '2026-01-01',
      end_date: '2026-01-30',
      options: { count: 50, offset: 0 },
    });

    const txns = (response.data.transactions || []).map(t => ({
      date: t.date,
      merchant: t.merchant_name || t.name,
      amount: t.amount,
      card: t.account_id,
    }));

    res.json(txns);
  } catch (err) {
    console.error('transactions error', err);
    res.status(500).json({ error: err?.response?.data || err.message || String(err) });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Backend running on ${PORT}`));
