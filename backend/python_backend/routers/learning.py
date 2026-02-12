from fastapi import APIRouter, HTTPException
from services.learning_engine import LearningEngine

router = APIRouter()

@router.get("/recommendations")
async def get_learning_recommendations(utilization: float = 0, risk_level: str = "Low"):
    try:
        recommendations = LearningEngine.get_recommendations(utilization, risk_level)
        return {"modules": recommendations}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
