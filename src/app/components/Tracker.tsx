import { CreditCardTracker } from '@/app/components/CreditCardTracker';

interface Card {
  id: number;
  name: string;
  lastFour: string;
  type: string;
  limit: number;
  balance: number;
  color: string;
  billingDay: number;
  dueDay: number;
}

interface TrackerProps {
  cards?: Card[];
  onCardsChange?: (cards: Card[]) => void;
  onCardAdded?: (cardName: string) => void;
  onCardDeleted?: (cardName: string) => void;
  transactions?: any[];
}

export function Tracker({ cards = [], transactions = [], onCardsChange, onCardAdded, onCardDeleted }: TrackerProps) {
  return <CreditCardTracker cards={cards} transactions={transactions} onCardsChange={onCardsChange} onCardAdded={onCardAdded} onCardDeleted={onCardDeleted} />;
}
