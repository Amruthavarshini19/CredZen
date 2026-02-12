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
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
