import json
import os
import time
from typing import List, Optional
from models.card import Card, CardCreate

DATA_FILE = "data/cards.json"

class CardService:
    def __init__(self):
        self._ensure_data_file()

    def _ensure_data_file(self):
        # Create data directory relative to this file or cwd
        # Assuming run from python_backend cwd
        os.makedirs(os.path.dirname(DATA_FILE), exist_ok=True)
        if not os.path.exists(DATA_FILE):
            with open(DATA_FILE, 'w') as f:
                json.dump([], f)

    def _load_cards(self) -> List[dict]:
        if not os.path.exists(DATA_FILE):
            return []
        try:
            with open(DATA_FILE, 'r') as f:
                content = f.read().strip()
                if not content:
                    return []
                return json.loads(content)
        except json.JSONDecodeError:
            # If file is corrupted or empty, re-initialize
            self._save_cards([])
            return []

    def _save_cards(self, cards: List[dict]):
        with open(DATA_FILE, 'w') as f:
            json.dump(cards, f, indent=2)

    def get_all_cards(self) -> List[Card]:
        cards_data = self._load_cards()
        return [Card(**c) for c in cards_data]

    def add_card(self, card_create: CardCreate) -> Card:
        cards = self._load_cards()
        new_id = int(time.time() * 1000) # Simple ID generation
        new_card_data = card_create.dict()
        new_card_data['id'] = new_id
        
        cards.append(new_card_data)
        self._save_cards(cards)
        
        return Card(**new_card_data)

    def update_card(self, card_id: int, card_update: CardCreate) -> Optional[Card]:
        cards = self._load_cards()
        for i, c in enumerate(cards):
            if c['id'] == card_id:
                updated_data = card_update.dict()
                updated_data['id'] = card_id
                cards[i] = updated_data
                self._save_cards(cards)
                return Card(**updated_data)
        return None

    def delete_card(self, card_id: int) -> bool:
        cards = self._load_cards()
        initial_len = len(cards)
        new_cards = [c for c in cards if c['id'] != card_id]
        if len(new_cards) < initial_len:
            self._save_cards(new_cards)
            return True
        return False

    def get_summary(self):
        cards = self.get_all_cards()
        total_limit = sum(c.limit for c in cards)
        total_balance = sum(c.balance for c in cards)
        total_available = total_limit - total_balance
        utilization = (total_balance / total_limit * 100) if total_limit > 0 else 0
        
        return {
            "total_cards": len(cards),
            "total_limit": total_limit,
            "total_balance": total_balance,
            "total_available": total_available,
            "utilization": round(utilization, 0)
        }
