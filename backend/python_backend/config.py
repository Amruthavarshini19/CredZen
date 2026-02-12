import os
from dotenv import load_dotenv

# Load .env from root directory (two levels up from python_backend)
load_dotenv(os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(__file__))), '.env'))

class Config:
    PLAID_CLIENT_ID = os.getenv('PLAID_CLIENT_ID')
    PLAID_SECRET = os.getenv('PLAID_SECRET') or os.getenv('PLAID_SANDBOX_SECRET')
    PLAID_ENV = os.getenv('PLAID_ENV', 'sandbox')
    HF_API_KEY = os.getenv('HF_API_KEY')
    PORT = int(os.getenv('PORT', 8000))

settings = Config()
