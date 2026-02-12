from fastapi import APIRouter, HTTPException
from typing import List
from models.card import Card, CardCreate
from services.card_service import CardService

router = APIRouter()
card_service = CardService()

@router.get("/", response_model=List[Card])
def read_cards():
    return card_service.get_all_cards()

@router.post("/", response_model=Card)
def create_card(card: CardCreate):
    return card_service.add_card(card)

@router.put("/{card_id}", response_model=Card)
def update_card(card_id: int, card: CardCreate):
    updated_card = card_service.update_card(card_id, card)
    if not updated_card:
        raise HTTPException(status_code=404, detail="Card not found")
    return updated_card

@router.delete("/{card_id}")
def delete_card(card_id: int):
    success = card_service.delete_card(card_id)
    if not success:
        raise HTTPException(status_code=404, detail="Card not found")
    return {"message": "Card deleted successfully"}

@router.get("/summary")
def get_summary():
    return card_service.get_summary()
