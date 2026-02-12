import httpx
from config import settings
import json

class LLMService:
    HF_API_URL = "https://router.huggingface.co/models/HuggingFaceH4/zephyr-7b-beta"
    
    @staticmethod
    async def generate_insights(prompt: str):
        headers = {
            "Authorization": f"Bearer {settings.HF_API_KEY}",
            "Content-Type": "application/json"
        }
        
        payload = {
            "inputs": prompt,
            "parameters": {
                "max_new_tokens": 1000,
                "temperature": 0.3,
                "return_full_text": False
            }
        }
        
        async with httpx.AsyncClient() as client:
            response = await client.post(LLMService.HF_API_URL, headers=headers, json=payload, timeout=30.0)
            
            if response.status_code != 200:
                raise Exception(f"HF API Error: {response.text}")
                
            return response.json()[0]['generated_text']

    @staticmethod
    def deterministic_card_recommendation(transactions: list):
        """
        Ported from Node.js: Calculates max reward card based on spending.
        """
        # Hardcoded rules ported from JS
        card_reward_rules = {
            "Chase": { "dining": 4, "travel": 4, "shopping": 2, "fuel": 1, "bills": 1, "default": 1 },
            "Regions": { "dining": 5, "shopping": 5, "bills": 5, "fuel": 2, "travel": 2, "default": 1 },
            "Bank of america": { "shopping": 5, "dining": 2, "fuel": 2, "bills": 2, "travel": 1, "default": 1 }
        }

        category_totals = {}
        total_spend = 0
        card_rewards = { "Chase": 0, "Regions": 0, "Bank of america": 0 }

        for tx in transactions:
            amount = float(tx.get('amount', 0))
            if amount > 0:
                cat_label = tx.get('category_label') or tx.get('category') or 'Other'
                category_totals[cat_label] = category_totals.get(cat_label, 0) + amount
                total_spend += amount
                
                # Determine rule category
                tx_cat = (tx.get('category_key') or '').lower()
                rule_cat = 'default'
                if 'food' in tx_cat or 'dining' in tx_cat: rule_cat = 'dining'
                elif 'travel' in tx_cat: rule_cat = 'travel'
                elif 'shopping' in tx_cat or 'grocer' in tx_cat: rule_cat = 'shopping'
                elif 'fuel' in tx_cat or 'gas' in tx_cat: rule_cat = 'fuel'
                elif 'bill' in tx_cat: rule_cat = 'bills'
                
                # Calculate rewards
                for card, rules in card_reward_rules.items():
                    rate = rules.get(rule_cat, rules['default'])
                    card_rewards[card] += amount * (rate / 100)

        # Determine winner
        best_card = max(card_rewards, key=card_rewards.get)
        max_reward = card_rewards[best_card]
        
        sorted_cats = sorted(category_totals.items(), key=lambda item: item[1], reverse=True)
        top_category = sorted_cats[0][0] if sorted_cats else "General"
        
        return {
            "best_card": best_card,
            "max_reward": round(max_reward, 2),
            "total_spend": round(total_spend, 2),
            "top_category": top_category,
            "potential_rewards": card_rewards
        }
