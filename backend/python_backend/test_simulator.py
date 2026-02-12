import httpx
import asyncio

async def test():
    url = "http://localhost:8000/api/simulator/simulate"
    payload = {
        "principal": 1000,
        "rate": 24,           # 24% APR
        "monthly_payment": 50 # $50/month
    }
    
    print(f"Sending request to {url} with payload: {payload}")
    
    async with httpx.AsyncClient() as client:
        try:
            response = await client.post(url, json=payload)
            response.raise_for_status()
            
            data = response.json()
            print("Summary Metrics:")
            print(f"Total Interest (Invisible Debt): {data.get('total_interest')}")
            print(f"Months (Time to Freedom): {data.get('months_to_pay_off')}")
            print(f"Total Payment (True Cost): {data.get('total_payment')}")
            print(f"Min Payment: {data.get('min_payment')}")
            
        except Exception as e:
            print(f"Error: {e}")

if __name__ == "__main__":
    asyncio.run(test())
