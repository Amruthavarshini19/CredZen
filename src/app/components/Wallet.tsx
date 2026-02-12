import { useState, useEffect } from 'react';
import { CreditCard, Plus, Eye, EyeOff, Trash2, Pencil } from 'lucide-react';
import { Button } from '@/app/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/app/components/ui/dialog';
import { Input } from '@/app/components/ui/input';
import { Label } from '@/app/components/ui/label';

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

interface WalletProps {
  cards?: Card[];
  onCardsChange?: (cards: Card[]) => void;
  onCardAdded?: (card: any) => void;
  onCardUpdated?: (card: any) => void;
  onCardDeleted?: (cardId: number) => void;
}

export function Wallet({ cards: initialCards = [], onCardsChange, onCardAdded, onCardUpdated, onCardDeleted }: WalletProps) {
  const [cards, setCards] = useState<Card[]>(initialCards);
  const [showAddCard, setShowAddCard] = useState(false);
  const [showCardNumbers, setShowCardNumbers] = useState<{ [key: number]: boolean }>({});

  // Sync with prop changes
  useEffect(() => {
    setCards(initialCards);
  }, [initialCards]);

  const [newCard, setNewCard] = useState({
    name: '',
    number: '',
    type: '',
    limit: '',
    billingDay: '15',
    dueDay: '5',
    balance: '0'
  });

  const [isEditing, setIsEditing] = useState(false);
  const [editingCardId, setEditingCardId] = useState<number | null>(null);

  const toggleCardNumber = (cardId: number) => {
    setShowCardNumbers(prev => ({
      ...prev,
      [cardId]: !prev[cardId]
    }));
  };

  const handleSaveCard = async () => {
    if (newCard.name && newCard.number && newCard.limit) {
      const lastFour = newCard.number.slice(-4);

      if (isEditing && editingCardId !== null) {
        // Prepare updated card object logic
        const updatedCardData = {
          id: editingCardId,
          name: newCard.name,
          lastFour: lastFour,
          type: newCard.type,
          limit: parseInt(newCard.limit),
          balance: parseFloat(newCard.balance) || 0,
          billingDay: parseInt(newCard.billingDay),
          dueDay: parseInt(newCard.dueDay),
          color: cards.find(c => c.id === editingCardId)?.color || 'from-purple-500 to-purple-700'
        };
        // Call parent handler
        onCardUpdated?.(updatedCardData);
      } else {
        const newCardData = {
          name: newCard.name,
          lastFour: lastFour,
          type: newCard.type || 'Visa',
          limit: parseInt(newCard.limit),
          balance: parseFloat(newCard.balance) || 0,
          color: 'from-purple-500 to-purple-700',
          billingDay: parseInt(newCard.billingDay),
          dueDay: parseInt(newCard.dueDay)
        };
        // Call parent handler
        onCardAdded?.(newCardData);
      }

      setNewCard({ name: '', number: '', type: '', limit: '', billingDay: '15', dueDay: '5', balance: '0' });
      setShowAddCard(false);
      setIsEditing(false);
      setEditingCardId(null);
    }
  };

  const handleEditCard = (card: Card) => {
    setNewCard({
      name: card.name,
      number: `**** **** **** ${card.lastFour}`,
      type: card.type,
      limit: card.limit.toString(),
      billingDay: card.billingDay.toString(),
      dueDay: card.dueDay.toString(),
      balance: card.balance.toString()
    });
    setIsEditing(true);
    setEditingCardId(card.id);
    setShowAddCard(true);
  };

  const [cardToDelete, setCardToDelete] = useState<Card | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const confirmDelete = (card: Card) => {
    setCardToDelete(card);
    setShowDeleteConfirm(true);
  };

  const handleDeleteCard = async () => {
    if (!cardToDelete) return;

    // Call parent handler
    onCardDeleted?.(cardToDelete.id);

    setShowDeleteConfirm(false);
    setCardToDelete(null);
  };

  const totalLimit = cards.reduce((sum, card) => sum + card.limit, 0);
  const totalBalance = cards.reduce((sum, card) => sum + card.balance, 0);
  const totalAvailableBalance = totalLimit - totalBalance;
  const overallUtilization = totalLimit > 0 ? Math.round((totalBalance / totalLimit) * 100) : 0;


  return (
    <div className="space-y-8" >
      {/* Header Section */}
      < div className="bg-purple-900/40 backdrop-blur-sm rounded-2xl p-8 border border-purple-500/30" >
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
              <CreditCard className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              Wallet
            </h1>
          </div>
          <Button
            onClick={() => {
              setIsEditing(false);
              setNewCard({ name: '', number: '', type: '', limit: '', billingDay: '15', dueDay: '5', balance: '0' });
              setShowAddCard(true);
            }}
            className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white"
          >
            <Plus className="mr-2 h-4 w-4" />
            Add Card
          </Button>
        </div>
        <p className="text-lg text-gray-300">
          Manage your credit cards and track your spending
        </p>
      </div >

      {/* Summary Stats */}
      < div className="grid md:grid-cols-3 gap-4" >
        <div className="bg-purple-900/40 backdrop-blur-sm rounded-xl p-6 border border-purple-500/30">
          <p className="text-sm text-gray-400 mb-2">Total Cards</p>
          <p className="text-3xl font-bold text-white">{cards.length}</p>
        </div>
        <div className="bg-purple-900/40 backdrop-blur-sm rounded-xl p-6 border border-purple-500/30">
          <p className="text-sm text-gray-400 mb-2">Total Credit Limit</p>
          <p className="text-3xl font-bold text-white">₹{totalLimit.toLocaleString()}</p>
        </div>
        <div className="bg-purple-900/40 backdrop-blur-sm rounded-xl p-6 border border-purple-500/30">
          <p className="text-sm text-gray-400 mb-2">Overall Utilization</p>
          <p className="text-3xl font-bold text-white">{overallUtilization}%</p>
          <p className={`text-xs font-medium mt-1 ${overallUtilization < 30 ? 'text-green-400' : 'text-pink-400'}`}>
            {overallUtilization < 30 ? 'Excellent!' : 'Consider reducing'}
          </p>
        </div>
      </div >

      {/* Cards Grid */}
      < div className="space-y-6" >
        <h2 className="text-2xl font-semibold text-white">Your Cards</h2>

        <div className="grid md:grid-cols-2 gap-6">
          {cards.map((card) => {
            const availableBalance = card.limit - card.balance;
            const utilization = card.limit > 0 ? Math.round((card.balance / card.limit) * 100) : 0;

            return (
              <div key={card.id} className="group relative">
                {/* Credit Card Visual */}
                <div className={`bg-gradient-to-br ${card.color} rounded-2xl p-6 text-white shadow-lg aspect-[1.586/1] flex flex-col justify-between relative overflow-hidden`}>
                  {/* Card Pattern Background */}
                  <div className="absolute inset-0 opacity-10">
                    <div className="absolute top-0 right-0 w-40 h-40 bg-white rounded-full -translate-y-20 translate-x-20" />
                    <div className="absolute bottom-0 left-0 w-32 h-32 bg-white rounded-full translate-y-16 -translate-x-16" />
                  </div>

                  <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity z-20">
                    <button
                      onClick={() => handleEditCard(card)}
                      className="w-10 h-10 bg-white/20 hover:bg-white/30 text-white rounded-full flex items-center justify-center transition-all shadow-lg border border-white/10"
                      title="Edit Card"
                    >
                      <Pencil className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => confirmDelete(card)}
                      className="w-10 h-10 bg-black/40 hover:bg-red-500/80 text-white/70 hover:text-white rounded-full flex items-center justify-center transition-all shadow-lg border border-white/10"
                      title="Delete Card"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>

                  {/* Card Header */}
                  <div className="relative z-10">
                    <p className="text-sm opacity-90 mb-1">{card.type}</p>
                    <p className="text-lg font-semibold">{card.name}</p>
                  </div>

                  {/* Card Number */}
                  <div className="relative z-10">
                    <div className="flex items-center gap-2 mb-4">
                      <p className="text-2xl font-mono tracking-wider">
                        {showCardNumbers[card.id] ? `**** **** **** ${card.lastFour}` : `•••• •••• •••• ${card.lastFour}`}
                      </p>
                      <button
                        onClick={() => toggleCardNumber(card.id)}
                        className="w-8 h-8 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center transition-colors"
                      >
                        {showCardNumbers[card.id] ? (
                          <EyeOff className="w-4 h-4" />
                        ) : (
                          <Eye className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Card Details Below */}
                <div className="bg-purple-900/40 backdrop-blur-sm rounded-xl p-4 border border-purple-500/30 mt-4">
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-400">Balance</span>
                      <span className="font-semibold text-white">₹{card.balance.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-400">Credit Limit</span>
                      <span className="font-semibold text-white">₹{card.limit.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-400">Available Credit</span>
                      <span className="font-semibold text-white">₹{(card.limit - card.balance).toLocaleString()}</span>
                    </div>
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm text-gray-400">Utilization</span>
                        <span className={`font-semibold ${utilization < 30 ? 'text-green-400' : 'text-pink-400'}`}>
                          {utilization}%
                        </span>
                      </div>
                      <div className="w-full bg-gray-700 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full transition-all ${utilization < 30 ? 'bg-green-500' : 'bg-pink-500'}`}
                          style={{ width: `${Math.min(utilization, 100)}%` }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div >

      {/* Add Card Dialog */}
      < Dialog open={showAddCard} onOpenChange={setShowAddCard} >
        <DialogContent className="bg-gradient-to-br from-gray-900 to-purple-900 border-purple-500/50">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-white">
              {isEditing ? 'Edit Card Details' : 'Add New Card'}
            </DialogTitle>
            <DialogDescription className="text-gray-300">
              {isEditing ? 'Update your credit card details below' : 'Enter your credit card details to add it to your wallet'}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 mt-4">
            <div>
              <Label htmlFor="cardName" className="text-gray-200">Card Name</Label>
              <Input
                id="cardName"
                placeholder="e.g., Chase Sapphire Preferred"
                value={newCard.name}
                onChange={(e) => setNewCard({ ...newCard, name: e.target.value })}
                className="bg-black/30 border-purple-500/50 text-white placeholder:text-gray-400"
              />
            </div>
            {!isEditing && (
              <div>
                <Label htmlFor="cardNumber" className="text-gray-200">Card Number</Label>
                <Input
                  id="cardNumber"
                  placeholder="1234 5678 9012 3456"
                  value={newCard.number}
                  onChange={(e) => setNewCard({ ...newCard, number: e.target.value.replace(/\s/g, '') })}
                  className="bg-black/30 border-purple-500/50 text-white placeholder:text-gray-400"
                />
              </div>
            )}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="cardType" className="text-gray-200">Card Type</Label>
                <Input
                  id="cardType"
                  placeholder="Visa, Mastercard, etc."
                  value={newCard.type}
                  onChange={(e) => setNewCard({ ...newCard, type: e.target.value })}
                  className="bg-black/30 border-purple-500/50 text-white placeholder:text-gray-400"
                />
              </div>
              <div>
                <Label htmlFor="currentBalance" className="text-gray-200">Current Balance</Label>
                <Input
                  id="currentBalance"
                  type="number"
                  placeholder="₹0"
                  value={newCard.balance}
                  onChange={(e) => setNewCard({ ...newCard, balance: e.target.value })}
                  className="bg-black/30 border-purple-500/50 text-white placeholder:text-gray-400"
                />
              </div>
            </div>
            <div>
              <Label htmlFor="creditLimit" className="text-gray-200">Credit Limit</Label>
              <Input
                id="creditLimit"
                type="number"
                placeholder="₹5,000"
                value={newCard.limit}
                onChange={(e) => setNewCard({ ...newCard, limit: e.target.value })}
                className="bg-black/30 border-purple-500/50 text-white placeholder:text-gray-400"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="billingDay" className="text-gray-200">Billing Day</Label>
                <Input
                  id="billingDay"
                  type="number"
                  placeholder="15"
                  value={newCard.billingDay}
                  onChange={(e) => setNewCard({ ...newCard, billingDay: e.target.value })}
                  className="bg-black/30 border-purple-500/50 text-white placeholder:text-gray-400"
                />
              </div>
              <div>
                <Label htmlFor="dueDay" className="text-gray-200">Due Day</Label>
                <Input
                  id="dueDay"
                  type="number"
                  placeholder="5"
                  value={newCard.dueDay}
                  onChange={(e) => setNewCard({ ...newCard, dueDay: e.target.value })}
                  className="bg-black/30 border-purple-500/50 text-white placeholder:text-gray-400"
                />
              </div>
            </div>
            <Button
              onClick={handleSaveCard}
              className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white"
            >
              {isEditing ? <Pencil className="mr-2 h-4 w-4" /> : <Plus className="mr-2 h-4 w-4" />}
              {isEditing ? 'Update Card' : 'Add Card'}
            </Button>
          </div>
        </DialogContent>
      </Dialog >

      {/* Delete Confirmation Dialog */}
      <Dialog open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm}>
        <DialogContent className="bg-gray-900 border-red-500/50 max-w-md">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-white flex items-center gap-2">
              <Trash2 className="w-6 h-6 text-red-500" />
              Delete Card
            </DialogTitle>
            <DialogDescription className="text-gray-300 pt-2">
              Are you sure you want to remove <span className="font-bold text-white">{cardToDelete?.name}</span>? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <div className="flex gap-4 mt-6">
            <Button
              variant="outline"
              onClick={() => setShowDeleteConfirm(false)}
              className="flex-1 bg-transparent border-gray-700 text-gray-300 hover:bg-gray-800"
            >
              Cancel
            </Button>
            <Button
              onClick={handleDeleteCard}
              className="flex-1 bg-red-600 hover:bg-red-700 text-white"
            >
              Delete
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div >
  );
}