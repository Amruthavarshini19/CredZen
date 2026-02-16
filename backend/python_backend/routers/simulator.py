from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from services.finance_engine import FinanceEngine

router = APIRouter()

class SimulationRequest(BaseModel):
    principal: float
    rate: float
    monthly_payment: float

@router.post("/simulate")
async def simulate_debt(request: SimulationRequest):
    try:
        result = FinanceEngine.calculate_amortization(
            request.principal,
            request.rate,
            request.monthly_payment
        )
        if "error" in result:
             raise HTTPException(status_code=400, detail=result["error"])
        
        # Determine strict utilization if possible, else 0
        # The FinanceEngine doesn't calculate utilization from loan params usually, 
        # but we can pass a placeholder or remove it from the prompt if not available.
        # For now, we'll pass the result dict to the LLM.
        
        from services.llm_service import LLMService
        
        # Prepare data for LLM
        llm_data = {
            "payment": result.get("total_payment_monthly", request.monthly_payment), # Ensure we have payment
            "total_interest": result.get("total_interest", 0),
            "months_to_pay_off": result.get("months_to_pay_off", 0),
            "utilization": 0 # Placeholder as this is a loan simulator, not credit card specific yet
        }
        
        # Get Nova Insights
        nova_insights = LLMService.generate_financial_insights(llm_data)
        
        result["nova_insights"] = nova_insights
        
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
