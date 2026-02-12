import plaid
from plaid.api import plaid_api
from plaid.model.link_token_create_request import LinkTokenCreateRequest
from plaid.model.link_token_create_request_user import LinkTokenCreateRequestUser
from plaid.model.item_public_token_exchange_request import ItemPublicTokenExchangeRequest
from plaid.model.transactions_get_request import TransactionsGetRequest
from plaid.model.transactions_get_request_options import TransactionsGetRequestOptions
from plaid.model.accounts_get_request import AccountsGetRequest
from plaid.model.products import Products
from plaid.model.country_code import CountryCode
from config import settings
import datetime

# Initialize Plaid Client
configuration = plaid.Configuration(
    host=plaid.Environment.Sandbox if settings.PLAID_ENV == 'sandbox' else plaid.Environment.Development,
    api_key={
        'clientId': settings.PLAID_CLIENT_ID,
        'secret': settings.PLAID_SECRET,
    }
)
api_client = plaid.ApiClient(configuration)
client = plaid_api.PlaidApi(api_client)

class PlaidService:
    @staticmethod
    def create_link_token(user_id: str):
        request = LinkTokenCreateRequest(
            products=[Products('transactions')],
            client_name="CredZen",
            country_codes=[CountryCode('US')],
            language='en',
            user=LinkTokenCreateRequestUser(
                client_user_id=user_id
            )
        )
        response = client.link_token_create(request)
        return response.to_dict()

    @staticmethod
    def exchange_public_token(public_token: str):
        request = ItemPublicTokenExchangeRequest(
            public_token=public_token
        )
        response = client.item_public_token_exchange(request)
        return response.to_dict()['access_token']

    @staticmethod
    def get_transactions(access_token: str, start_date: str, end_date: str):
        # 1. Fetch Accounts to map IDs to Names
        accounts_request = AccountsGetRequest(access_token=access_token)
        accounts_response = client.accounts_get(accounts_request)
        accounts = accounts_response.to_dict()['accounts']
        
        # Use official_name if available (e.g. "Plaid Gold Standard..."), else name (e.g. "Credit Card")
        account_map = {}
        for acc in accounts:
            name = acc.get('official_name') or acc.get('name') or "Unknown Account"
            mask = acc.get('mask') or "...."
            account_map[acc['account_id']] = f"{name} ({mask})"

        # 2. Fetch Transactions
        request = TransactionsGetRequest(
            access_token=access_token,
            start_date=datetime.date.fromisoformat(start_date),
            end_date=datetime.date.fromisoformat(end_date),
            options=TransactionsGetRequestOptions(
                count=500,
                offset=0
            )
        )
        response = client.transactions_get(request)
        raw_transactions = response.to_dict()['transactions']

        # 3. Format for Frontend
        formatted_transactions = []
        for tx in raw_transactions:
            # Better categorization logic
            category = "Uncategorized"
            category_label = "General"
            
            if tx.get('personal_finance_category'):
                category = tx['personal_finance_category']['primary']
                # Convert LOAN_PAYMENTS_CREDIT_CARD_PAYMENT -> Loan Payments Credit Card Payment
                category_label = tx['personal_finance_category']['detailed'].replace('_', ' ').title()
            elif tx.get('category') and len(tx['category']) > 0:
                category = tx['category'][0]
                category_label = tx['category'][-1]

            formatted_transactions.append({
                "date": str(tx['date']),
                "merchant": tx['name'],
                "amount": tx['amount'],
                "category": category,
                "category_label": category_label,
                "card": account_map.get(tx['account_id'], "Unknown Card")
            })

        return formatted_transactions
