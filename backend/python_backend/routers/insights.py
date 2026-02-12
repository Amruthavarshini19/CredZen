from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List, Dict, Any, Optional
from services.llm_service import LLMService

router = APIRouter()

class Transaction(BaseModel):
    amount: float
    category: str
    category_label: Optional[str] = None
    category_key: Optional[str] = None

class AnalysisRequest(BaseModel):
    transactions: List[dict]
    cards: List[dict]

@router.post("/analyze")
async def analyze_finances(request: AnalysisRequest):
    try:
        # 1. Deterministic Calculation (The "Max Reward Algorithm")
        stats = LLMService.deterministic_card_recommendation(request.transactions)
        
        # 2. AI Qualitative Advice
        prompt = f"""
<|system|>
You are a financial advisor AI for CredZen.
Your goal is to generate:
1. "spending_insights": simple text comments about their highest and lowest spending.
2. "smart_card_usage_advice": You MUST follow this EXACT phrasing: "Use {stats['best_card']} for your next {stats['top_category']} for claiming your {stats['max_reward']} points/cashback."
3. "reward_optimization_tips": generic tips to save money.

Top Spending Category: {stats['top_category']}
Best Card: {stats['best_card']}
Total Potential Reward: {stats['max_reward']}

Return a valid JSON object matching this structure EXACTLY:
{{
  "spending_insights": ["Insight 1", "Insight 2"],
  "smart_card_usage_advice": "Use {stats['best_card']} for your next {stats['top_category']}...",
  "reward_optimization_tips": ["Tip 1", "Tip 2"]
}}
Do NOT wrap in markdown. Return raw JSON.
</s>
<|user|>
Generate insights.
</s>
<|assistant|>
"""
        ai_response_text = await LLMService.generate_insights(prompt)
        
        # Parse JSON from AI response
        import json
        try:
            start = ai_response_text.find('{')
            end = ai_response_text.rfind('}') + 1
            ai_data = json.loads(ai_response_text[start:end])
        except:
            ai_data = {
                "spending_insights": ["Spending analysis available."],
                "smart_card_usage_advice": f"Use {stats['best_card']} for your next {stats['top_category']}.",
                "reward_optimization_tips": ["Track your spending."]
            }

        return {
            "top_spending_categories": [{"category": stats['top_category'], "amount": stats['total_spend'], "percentage": 100}], # Simplified for now
            "spending_insights": ai_data.get("spending_insights", []),
            "smart_card_usage_advice": ai_data.get("smart_card_usage_advice", ""),
            "reward_optimization_tips": ai_data.get("reward_optimization_tips", []),
            "potential_rewards": stats['potential_rewards']
        }

    except Exception as e:
        print(f"Error in analysis: {e}")
        raise HTTPException(status_code=500, detail=str(e))
