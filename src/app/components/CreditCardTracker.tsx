import { useState, ChangeEvent, useEffect } from 'react';
import { CreditCard, Plus, Edit2, Trash2, Eye, EyeOff, DollarSign, TrendingUp, AlertCircle } from 'lucide-react';
import { Button } from '@/app/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/app/components/ui/dialog';
import { Input } from '@/app/components/ui/input';
import { Label } from '@/app/components/ui/label';
import { Card } from '@/app/components/ui/card';

interface WalletCard {
  id: number;
  name: string;
  lastFour: string;
  type: string;
  limit: number;
  balance: number;
  color: string;
}

interface CreditCardData {
  id: string;
  cardName: string;
  cardNumber: string;
  limit: number;
  spend: number;
  balance: number;
  lastFourDigits: string;
}

interface CreditCardTrackerProps {
  cards?: WalletCard[];
  onCardsChange?: (cards: WalletCard[]) => void;
  onCardAdded?: (cardName: string) => void;
  onCardDeleted?: (cardName: string) => void;
}

export function CreditCardTracker({ cards: walletCards = [], onCardsChange, onCardAdded, onCardDeleted }: CreditCardTrackerProps) {
  const [cards, setCards] = useState<CreditCardData[]>([
    {
      id: '1',
      cardName: 'Chase Sapphire Preferred',
      cardNumber: '4532xxxxxxxx1234',
      lastFourDigits: '1234',
      limit: 50000,
      spend: 18500,
      balance: 31500
    },
    {
      id: '2',
      cardName: 'American Express Gold',
      cardNumber: '3782xxxxxxxx2234',
      lastFourDigits: '2234',
      limit: 75000,
      spend: 42300,
      balance: 32700
    }
  ]);

  // Sync wallet cards into tracker display
  useEffect(() => {
    if (walletCards && walletCards.length > 0) {
      const trackerCards = walletCards.map((card, index) => ({
        id: card.id.toString(),
        cardName: card.name,
        cardNumber: `****${card.lastFour}`,
        lastFourDigits: card.lastFour,
        limit: card.limit,
        spend: card.balance,
        balance: card.limit - card.balance
      }));
      setCards(trackerCards);
    }
  }, [walletCards]);

  const [showCardNumbers, setShowCardNumbers] = useState<Record<string, boolean>>({});
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditingId, setIsEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<Partial<CreditCardData>>({
    cardName: '',
    cardNumber: '',
    limit: 0,
    spend: 0,
    balance: 0,
  });

  // Calculate totals
  const totals = {
    totalLimit: cards.reduce((sum, card) => sum + card.limit, 0),
    totalSpend: cards.reduce((sum, card) => sum + card.spend, 0),
    totalBalance: cards.reduce((sum, card) => sum + card.balance, 0),
  };

  const handleAddCard = () => {
    setFormData({
      cardName: '',
      cardNumber: '',
      limit: 0,
      spend: 0,
      balance: 0,
    });
    setIsEditingId(null);
    setIsAddDialogOpen(true);
  };

  const handleEditCard = (card: CreditCardData) => {
    setFormData(card);
    setIsEditingId(card.id);
    setIsAddDialogOpen(true);
  };

  const handleSaveCard = () => {
    if (!formData.cardName || !formData.cardNumber || formData.limit === 0) {
      alert('Please fill in all fields');
      return;
    }

    const lastFourDigits = formData.cardNumber.slice(-4);

    if (isEditingId) {
      // Edit existing card
      setCards(cards.map(card =>
        card.id === isEditingId
          ? {
              ...card,
              cardName: formData.cardName || card.cardName,
              cardNumber: formData.cardNumber || card.cardNumber,
              lastFourDigits: lastFourDigits,
              limit: formData.limit || card.limit,
              spend: formData.spend || card.spend,
              balance: formData.balance || card.balance,
            }
          : card
      ));
    } else {
      // Add new card
      const newCard: CreditCardData = {
        id: Date.now().toString(),
        cardName: formData.cardName || 'Unnamed Card',
        cardNumber: formData.cardNumber || '',
        lastFourDigits: lastFourDigits,
        limit: formData.limit || 0,
        spend: formData.spend || 0,
        balance: formData.balance || 0,
      };
      const updatedCards = [...cards, newCard];
      setCards(updatedCards);

      // Sync to wallet
      const newWalletCard: WalletCard = {
        id: parseInt(newCard.id),
        name: newCard.cardName,
        lastFour: lastFourDigits,
        type: 'Visa',
        limit: newCard.limit,
        balance: newCard.spend,
        color: 'from-blue-500 to-blue-700'
      };
      onCardsChange?.([...walletCards, newWalletCard]);
    }

    setIsAddDialogOpen(false);
    setFormData({});
  };

  const handleDeleteCard = (id: string) => {
    if (confirm('Are you sure you want to delete this card?')) {
      // Find the card being deleted to get its name
      const cardToDelete = cards.find(card => card.id === id);
      
      const updatedCards = cards.filter(card => card.id !== id);
      setCards(updatedCards);
      
      // Sync to wallet
      const updatedWalletCards = walletCards.filter(card => card.id.toString() !== id);
      onCardsChange?.(updatedWalletCards);
      
      // Notify parent about deletion for activity tracking
      if (cardToDelete) {
        onCardDeleted?.(`Deleted card: ${cardToDelete.cardName}`);
      }
    }
  };

  const toggleCardNumberVisibility = (id: string) => {
    setShowCardNumbers(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const getUtilizationPercentage = (spend: number, limit: number) => {
    return limit > 0 ? Math.round((spend / limit) * 100) : 0;
  };

  const getUtilizationColor = (percentage: number) => {
    if (percentage <= 30) return 'text-green-400';
    if (percentage <= 70) return 'text-yellow-400';
    return 'text-red-400';
  };

  const getUtilizationBgColor = (percentage: number) => {
    if (percentage <= 30) return 'bg-green-500/20';
    if (percentage <= 70) return 'bg-yellow-500/20';
    return 'bg-red-500/20';
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mb-2">
            Credit Card Tracker
          </h1>
          <p className="text-gray-300">Track and manage all your credit cards in one secure place</p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button
              onClick={handleAddCard}
              className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white flex items-center gap-2"
            >
              <Plus className="w-5 h-5" />
              Add Card
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-gray-900 border-purple-500/50">
            <DialogHeader>
              <DialogTitle className="text-white">
                {isEditingId ? 'Edit Card' : 'Add New Card'}
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label className="text-gray-300">Card Name</Label>
                <Input
                  placeholder="e.g., Chase Sapphire Preferred"
                  value={formData.cardName || ''}
                  onChange={(e: ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, cardName: e.target.value })}
                  className="bg-gray-800 border-gray-700 text-white placeholder-gray-500"
                />
              </div>
              <div>
                <Label className="text-gray-300">Card Number</Label>
                <Input
                  placeholder="1234567890123456"
                  value={formData.cardNumber || ''}
                  onChange={(e: ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, cardNumber: e.target.value })}
                  className="bg-gray-800 border-gray-700 text-white placeholder-gray-500"
                />
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label className="text-gray-300">Credit Limit</Label>
                  <Input
                    type="number"
                    placeholder="50000"
                    value={formData.limit || ''}
                    onChange={(e: ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, limit: parseFloat(e.target.value) })}
                    className="bg-gray-800 border-gray-700 text-white placeholder-gray-500"
                  />
                </div>
                <div>
                  <Label className="text-gray-300">Current Spend</Label>
                  <Input
                    type="number"
                    placeholder="0"
                    value={formData.spend || ''}
                    onChange={(e: ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, spend: parseFloat(e.target.value) })}
                    className="bg-gray-800 border-gray-700 text-white placeholder-gray-500"
                  />
                </div>
                <div>
                  <Label className="text-gray-300">Available Balance</Label>
                  <Input
                    type="number"
                    placeholder="0"
                    value={formData.balance || ''}
                    onChange={(e: ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, balance: parseFloat(e.target.value) })}
                    className="bg-gray-800 border-gray-700 text-white placeholder-gray-500"
                  />
                </div>
              </div>
              <div className="flex gap-3 justify-end">
                <Button
                  variant="outline"
                  onClick={() => setIsAddDialogOpen(false)}
                  className="border-gray-700 text-gray-300 hover:bg-gray-800"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleSaveCard}
                  className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white"
                >
                  Save Card
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Overall Summary Cards */}
      <div className="grid md:grid-cols-3 gap-6">
        <Card className="bg-gradient-to-br from-purple-900/40 to-purple-800/20 border-purple-500/30 p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-400">Total Credit Limit</span>
            <DollarSign className="w-5 h-5 text-purple-400" />
          </div>
          <p className="text-3xl font-bold text-white">₹{totals.totalLimit.toLocaleString()}</p>
          <p className="text-xs text-gray-400 mt-2">Across all cards</p>
        </Card>

        <Card className="bg-gradient-to-br from-pink-900/40 to-pink-800/20 border-pink-500/30 p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-400">Total Spend</span>
            <TrendingUp className="w-5 h-5 text-pink-400" />
          </div>
          <p className="text-3xl font-bold text-white">₹{totals.totalSpend.toLocaleString()}</p>
          <p className="text-xs text-gray-400 mt-2">{((totals.totalSpend / totals.totalLimit) * 100).toFixed(1)}% utilized</p>
        </Card>

        <Card className="bg-gradient-to-br from-emerald-900/40 to-emerald-800/20 border-emerald-500/30 p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-400">Total Available Balance</span>
            <CreditCard className="w-5 h-5 text-emerald-400" />
          </div>
          <p className="text-3xl font-bold text-white">₹{totals.totalBalance.toLocaleString()}</p>
          <p className="text-xs text-gray-400 mt-2">Ready to spend</p>
        </Card>
      </div>

      {/* Cards List */}
      <div className="space-y-4">
        <h2 className="text-2xl font-semibold text-white">Your Cards</h2>
        {cards.length === 0 ? (
          <Card className="bg-purple-900/40 border-purple-500/30 p-8 text-center">
            <CreditCard className="w-12 h-12 text-purple-400 mx-auto mb-4 opacity-50" />
            <p className="text-gray-300 mb-4">No cards added yet</p>
            <Button
              onClick={handleAddCard}
              className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Your First Card
            </Button>
          </Card>
        ) : (
          cards.map((card) => {
            const utilization = getUtilizationPercentage(card.spend, card.limit);
            return (
              <Card
                key={card.id}
                className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 border-purple-500/30 hover:border-purple-500/60 transition-all overflow-hidden"
              >
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                        <CreditCard className="w-8 h-8 text-white" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-white">{card.cardName}</h3>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-sm text-gray-400">
                            {showCardNumbers[card.id] ? card.cardNumber : `****${card.lastFourDigits}`}
                          </span>
                          <button
                            onClick={() => toggleCardNumberVisibility(card.id)}
                            className="text-gray-500 hover:text-gray-300 transition-colors"
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
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEditCard(card)}
                        className="text-blue-400 hover:bg-blue-500/20 hover:text-blue-300"
                      >
                        <Edit2 className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteCard(card.id)}
                        className="text-red-400 hover:bg-red-500/20 hover:text-red-300"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>

                  {/* Card Stats */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                    <div className="bg-black/30 rounded-lg p-4">
                      <p className="text-gray-400 text-sm mb-1">Credit Limit</p>
                      <p className="text-xl font-bold text-white">₹{card.limit.toLocaleString()}</p>
                    </div>
                    <div className="bg-black/30 rounded-lg p-4">
                      <p className="text-gray-400 text-sm mb-1">Current Spend</p>
                      <p className="text-xl font-bold text-white">₹{card.spend.toLocaleString()}</p>
                    </div>
                    <div className="bg-black/30 rounded-lg p-4">
                      <p className="text-gray-400 text-sm mb-1">Available Balance</p>
                      <p className="text-xl font-bold text-white">₹{card.balance.toLocaleString()}</p>
                    </div>
                  </div>

                  {/* Utilization Bar */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-400">Credit Utilization</span>
                      <span className={`text-sm font-semibold ${getUtilizationColor(utilization)}`}>
                        {utilization}%
                      </span>
                    </div>
                    <div className="w-full bg-gray-700/50 rounded-full h-2 overflow-hidden">
                      <div
                        className={`h-full ${getUtilizationBgColor(utilization)} transition-all`}
                        style={{ width: `${Math.min(utilization, 100)}%` }}
                      />
                    </div>
                    {utilization > 70 && (
                      <div className="flex items-center gap-2 mt-3 p-3 bg-red-500/20 rounded-lg border border-red-500/30">
                        <AlertCircle className="w-4 h-4 text-red-400" />
                        <span className="text-sm text-red-300">High utilization: Consider paying down this card</span>
                      </div>
                    )}
                  </div>
                </div>
              </Card>
            );
          })
        )}
      </div>

      {/* Insights */}
      {cards.length > 0 && (
        <Card className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 border-purple-400/50 p-6">
          <div className="flex items-start gap-4">
            <AlertCircle className="w-6 h-6 text-purple-400 flex-shrink-0 mt-1" />
            <div className="space-y-2">
              <h3 className="font-semibold text-white">Credit Card Insights</h3>
              <ul className="space-y-1 text-sm text-gray-200">
                <li>• You have {cards.length} credit card{cards.length > 1 ? 's' : ''} with a combined limit of ₹{totals.totalLimit.toLocaleString()}</li>
                <li>• Overall utilization: {((totals.totalSpend / totals.totalLimit) * 100).toFixed(1)}% of your total available credit</li>
                <li>• Total available balance: ₹{totals.totalBalance.toLocaleString()}</li>
                {totals.totalSpend > totals.totalLimit * 0.7 && (
                  <li className="text-red-300">⚠️ Your overall utilization is high. Try to keep it below 30% for better credit health.</li>
                )}
              </ul>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
}
