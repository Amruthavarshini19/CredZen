import httpx
import asyncio
import json

async def test():
    url = "http://localhost:8000/api/simulator/simulate"
    payload = {
        "principal": 1000,
        "rate": 24,           # 24% APR
        "monthly_payment": 50 # ₹50/month

    }
    
    print(f"Sending request to {url} with payload: {payload}")
    
    async with httpx.AsyncClient() as client:
        try:
            response = await client.post(url, json=payload)
            response.raise_for_status()
            
            data = response.json()
            print("Full Response Data:")
            print(json.dumps(data, indent=2))


            
        except Exception as e:
            print(f"Error: {e}")

if __name__ == "__main__":
    asyncio.run(test())
