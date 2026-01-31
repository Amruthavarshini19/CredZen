import os
from datetime import datetime, timedelta
from typing import Dict

import requests
from dotenv import load_dotenv
from fastapi import FastAPI, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware

# Load .env from workspace root (assumes backend/ is one level deep)
root_env = os.path.join(os.path.dirname(os.path.dirname(__file__)), '..', '.env')
load_dotenv(root_env)

PLAID_CLIENT_ID = os.getenv('PLAID_CLIENT_ID')
PLAID_SECRET = os.getenv('PLAID_SANDBOX_SECRET')
PLAID_ENV = os.getenv('PLAID_ENV', 'sandbox')  # default to sandbox

PLAID_BASE = 'https://sandbox.plaid.com' if PLAID_ENV == 'sandbox' else 'https://development.plaid.com'

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Store access tokens in memory (for demo only)
_access_tokens: Dict[str, str] = {}

@app.post('/plaid/create_link_token')
async def create_link_token(request: Request):
    body = {
        "client_id": PLAID_CLIENT_ID,
        "secret": PLAID_SECRET,
        "client_name": "CredZen Demo",
        "user": {"client_user_id": "user-id-1"},
        "products": ["transactions"],
        "country_codes": ["US"],
        "language": "en"
    }

    res = requests.post(f"{PLAID_BASE}/link/token/create", json=body)
    if res.status_code != 200:
        raise HTTPException(status_code=500, detail=res.text)
    return res.json()

@app.post('/plaid/exchange_public_token')
async def exchange_public_token(data: Dict):
    public_token = data.get('public_token')
    if not public_token:
        raise HTTPException(status_code=400, detail='public_token required')

    res = requests.post(f"{PLAID_BASE}/item/public_token/exchange", json={
        "client_id": PLAID_CLIENT_ID,
        "secret": PLAID_SECRET,
        "public_token": public_token
    })
    if res.status_code != 200:
        raise HTTPException(status_code=500, detail=res.text)

    body = res.json()
    access_token = body.get('access_token')
    item_id = body.get('item_id')
    # For demo, store under a single key
    _access_tokens[item_id or 'default'] = access_token
    return {"status": "ok", "item_id": item_id}

@app.get('/plaid/transactions')
async def get_transactions(item_id: str = None):
    # Try to find access token
    if item_id and item_id in _access_tokens:
        access_token = _access_tokens[item_id]
    elif len(_access_tokens) == 1:
        access_token = next(iter(_access_tokens.values()))
    elif 'default' in _access_tokens:
        access_token = _access_tokens['default']
    else:
        raise HTTPException(status_code=404, detail='No connected bank found')

    end_date = datetime.utcnow().date()
    start_date = end_date - timedelta(days=30)

    req = {
        "client_id": PLAID_CLIENT_ID,
        "secret": PLAID_SECRET,
        "access_token": access_token,
        "start_date": start_date.isoformat(),
        "end_date": end_date.isoformat(),
        "options": {"count": 50, "offset": 0}
    }

    res = requests.post(f"{PLAID_BASE}/transactions/get", json=req)
    if res.status_code != 200:
        raise HTTPException(status_code=500, detail=res.text)

    j = res.json()
    transactions = j.get('transactions', [])
    # Simplify response for frontend
    simplified = [
        {
            'id': t.get('transaction_id') or t.get('account_id') or str(i),
            'name': t.get('name'),
            'amount': t.get('amount'),
            'date': t.get('date'),
            'merchant_name': t.get('merchant_name')
        }
        for i, t in enumerate(transactions)
    ]
    return simplified

if __name__ == '__main__':
    import uvicorn
    uvicorn.run('backend.app.main:app', host='0.0.0.0', port=8000, reload=True)
