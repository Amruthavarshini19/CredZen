from pydantic import BaseModel
from typing import Optional

class CardBase(BaseModel):
    name: str
    lastFour: str
    type: str
    limit: float
    balance: float
    billingDay: int
    dueDay: int
    color: str = "from-purple-500 to-purple-700"

class CardCreate(CardBase):
    pass

class Card(CardBase):
    id: int

    class Config:
        from_attributes = True
