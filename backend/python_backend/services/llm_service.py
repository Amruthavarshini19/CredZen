import httpx
import boto3
from config import settings
import json

class LLMService:
    HF_API_URL = "https://router.huggingface.co/models/HuggingFaceH4/zephyr-7b-beta"
    
    @staticmethod
    def generate_insights(prompt: str):
        try:
            client = boto3.client("bedrock-runtime", region_name="us-east-1")
            
            body = json.dumps({
                "inferenceConfig": {
                    "max_new_tokens": 1000
                },
                "messages": [
                    {
                        "role": "user",
                        "content": [
                            {
                                "text": prompt
                            }
                        ]
                    }
                ]
            })

            model_id = "amazon.nova-micro-v1:0"
            
            response = client.invoke_model(
                modelId=model_id,
                body=body
            )

            response_body = json.loads(response.get("body").read())
            output_text = response_body.get("output", {}).get("message", {}).get("content", [])[0].get("text", "")
            return output_text
            
        except Exception as e:
            print(f"Error calling Amazon Nova: {e}")
            # Return a fallback JSON string so the parser in insights.py doesn't crash completely, 
            # or just return empty string and let caller handle. 
            # The caller expects a string containing JSON.
            return "{}"

    @staticmethod
    def generate_financial_insights(data: dict):
        """
        Generates human-friendly financial insights using Amazon Nova via AWS Bedrock.
        """
        try:
            client = boto3.client("bedrock-runtime", region_name="us-east-1")
            
            prompt = f"""
            You are a friendly and wise financial assistant named Nova. 
            Analyze the following financial data for a user's loan/debt scenario (all values in Indian Rupees - ₹):
            
            - Monthly Payment (EMI): ₹{data.get('payment', 0)}
            - Total Interest Payable: ₹{data.get('total_interest', 0)}
            - Time to Debt Freedom: {data.get('months_to_pay_off', 0)} months
            - Current Utilization: {data.get('utilization', 0)}% (if applicable)

            
            Your task is to provide VERY CONCISE (max 1-2 short sentences each) insights:
            1. **Human-Friendly Explanation**: What these numbers mean in simple terms.
            2. **Behavioral Context**: A quick RELATABLE analogy or nudge.
            3. **Long-Term Impact**: The key financial takeaway.
            
            Output the response in a clear, structured JSON format with keys: "explanation", "behavioral_context", "long_term_impact".
            Do not use markdown formatting for the JSON. Just return the raw JSON object.
            Be extremely brief.
            """

            
            body = json.dumps({
                "inferenceConfig": {
                    "max_new_tokens": 1000
                },
                "messages": [
                    {
                        "role": "user",
                        "content": [
                            {
                                "text": prompt
                            }
                        ]
                    }
                ]
            })

            model_id = "amazon.nova-micro-v1:0"
            
            response = client.invoke_model(
                modelId=model_id,
                body=body
            )

            response_body = json.loads(response.get("body").read())
            output_text = response_body.get("output", {}).get("message", {}).get("content", [])[0].get("text", "")
            
            # Attempt to parse JSON from the output
            try:
                start = output_text.find('{')
                end = output_text.rfind('}') + 1
                return json.loads(output_text[start:end])
            except:
                # Fallback if JSON parsing fails
                return {
                    "explanation": output_text,
                    "behavioral_context": "Could not parse specific context.",
                    "long_term_impact": "Could not parse specific impact."
                }
                
        except Exception as e:
            print(f"Error calling Amazon Nova: {e}")
            return {
                "explanation": "Nova is currently unavailable to analyze your finances.",
                "behavioral_context": "Please check back later.",
                "long_term_impact": "We are working on restoring the service."
            }

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
