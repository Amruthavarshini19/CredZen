import { CreditCardTracker } from '@/app/components/CreditCardTracker';

interface Card {
  id: number;
  name: string;
  lastFour: string;
  type: string;
  limit: number;
  balance: number;
  color: string;
}

interface TrackerProps {
  cards?: Card[];
  onCardsChange?: (cards: Card[]) => void;
  onCardAdded?: (cardName: string) => void;
  onCardDeleted?: (cardName: string) => void;
}

export function Tracker({ cards = [], onCardsChange, onCardAdded, onCardDeleted }: TrackerProps) {
  return <CreditCardTracker cards={cards} onCardsChange={onCardsChange} onCardAdded={onCardAdded} onCardDeleted={onCardDeleted} />;
}
