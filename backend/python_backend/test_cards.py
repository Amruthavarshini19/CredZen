import httpx
import asyncio

async def test_cards():
    # FastAPI redirects /api/cards to /api/cards/ if the route is defined as "/"
    base_url = "http://localhost:8000/api/cards" 
    
    print("\n1. Testing GET /api/cards (Initial State)")
    async with httpx.AsyncClient(follow_redirects=True) as client:
        res = await client.get(base_url)
        if res.status_code != 200:
            print(f"Error fetching cards: {res.status_code}, Body: {res.text}")
        else:
            print(f"Status: {res.status_code}, Cards: {len(res.json())}")

    print("\n2. Testing POST /api/cards (Add Card)")
    new_card = {
        "name": "Test Python Card",
        "lastFour": "9999",
        "type": "Visa",
        "limit": 5000,
        "balance": 250,
        "billingDay": 1,
        "dueDay": 15
    }
    
    async with httpx.AsyncClient(follow_redirects=True) as client:
        res = await client.post(base_url, json=new_card)
        if res.status_code == 200:
            card = res.json()
            print(f"Status: {res.status_code}, Created Card ID: {card['id']}")
            card_id = card['id']
            
            # 3. Verify Update
            print(f"\n3. Testing PUT /api/cards/{card_id}")
            update_data = new_card.copy()
            update_data['balance'] = 1000
            res = await client.put(f"{base_url}/{card_id}", json=update_data)
            print(f"Status: {res.status_code}, New Balance: {res.json()['balance']}")
            
            # 4. Verify Delete
            print(f"\n4. Testing DELETE /api/cards/{card_id}")
            res = await client.delete(f"{base_url}/{card_id}")
            print(f"Status: {res.status_code}, Response: {res.json()}")
            
        else:
             print(f"Failed to create card:Status {res.status_code} {res.text}")

if __name__ == "__main__":
    asyncio.run(test_cards())
