from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from services.plaid_service import PlaidService

router = APIRouter()

class LinkTokenRequest(BaseModel):
    user_id: str

class PublicTokenRequest(BaseModel):
    public_token: str

@router.post("/create_link_token")
async def create_link_token(request: LinkTokenRequest):
    try:
        return PlaidService.create_link_token(request.user_id)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/exchange_public_token")
async def exchange_token(request: PublicTokenRequest):
    try:
        access_token = PlaidService.exchange_public_token(request.public_token)
        return {"access_token": access_token}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/transactions")
async def get_transactions(access_token: str):
    try:
        # Hardcoded date range for MVP
        return PlaidService.get_transactions(access_token, "2024-01-01", "2026-02-01")
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
