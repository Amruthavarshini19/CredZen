import { Brain, TrendingUp, DollarSign, Percent, Sparkles, ExternalLink } from 'lucide-react';
import { Button } from '@/app/components/ui/button';

interface Card {
  id: number;
  name: string;
  lastFour: string;
  type: string;
  limit: number;
  balance: number;
  color: string;
}

interface SmartPickProps {
  cards?: Card[];
}

export function SmartPick({ cards = [] }: SmartPickProps) {
  // Calculate totals from user's cards
  const totalCreditLimit = cards.length > 0 
    ? cards.reduce((sum, card) => sum + card.limit, 0)
    : 5000;
  
  const totalAvailableBalance = cards.length > 0
    ? cards.reduce((sum, card) => sum + (card.limit - card.balance), 0)
    : 3800;

  const utilizationPercentage = totalCreditLimit > 0
    ? Math.round((totalAvailableBalance / totalCreditLimit) * 100)
    : 24;

  const totalMonthlySpend = cards.length > 0
    ? cards.reduce((sum, card) => sum + card.balance, 0)
    : 1200;

  const recommendations = [
    {
      name: 'Chase Sapphire Preferred',
      issuer: 'Chase',
      score: 95,
      reason: 'Perfect for your travel spending patterns',
      annualFee: 95,
      signupBonus: '60,000 points',
      apr: '21.49% - 28.49%',
      benefits: [
        'Earn 5x points on travel through Chase portal',
        '3x points on dining and streaming',
        '2x points on all other travel',
        'No foreign transaction fees'
      ],
      image: 'https://images.unsplash.com/photo-1559526324-593bc073d938?w=400&q=80'
    },
    {
      name: 'Capital One Quicksilver',
      issuer: 'Capital One',
      score: 88,
      reason: 'Simple cashback with no categories to track',
      annualFee: 0,
      signupBonus: '₹200 cashback',
      apr: '19.99% - 29.99%',
      benefits: [
        '1.5% cashback on all purchases',
        'No annual fee',
        'No foreign transaction fees',
        '0% intro APR for 15 months'
      ],
      image: 'https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=400&q=80'
    },
    {
      name: 'American Express Gold',
      issuer: 'American Express',
      score: 82,
      reason: 'Maximize your dining and grocery rewards',
      annualFee: 250,
      signupBonus: '60,000 points',
      apr: '21.49% - 28.49%',
      benefits: [
        '4x points at restaurants',
        '4x points at U.S. supermarkets',
        '3x points on flights',
        '₹120 dining credit annually'
      ],
      image: 'https://images.unsplash.com/photo-1591085686350-798c0f9faa7f?w=400&q=80'
    }
  ];

  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div className="bg-purple-900/40 backdrop-blur-sm rounded-2xl p-8 border border-purple-500/30">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
            <Brain className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
            Smart Pick
          </h1>
        </div>
        <p className="text-lg text-gray-300">
          AI-powered card recommendations tailored to your profile
        </p>
      </div>

      {/* User Profile Summary */}
      <div className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 backdrop-blur-sm rounded-2xl p-6 border border-purple-400/50">
        <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-pink-400" />
          Your Profile Analysis
        </h2>
        <div className="grid md:grid-cols-3 gap-4">
          <div className="bg-purple-900/40 rounded-xl p-4 border border-purple-500/30">
            <div className="flex items-center gap-2 mb-2">
              <DollarSign className="w-5 h-5 text-purple-400" />
              <span className="text-sm text-gray-300">Total Credit Limit</span>
            </div>
            <p className="text-2xl font-bold text-white">₹{totalCreditLimit.toLocaleString()}</p>
          </div>
          <div className="bg-purple-900/40 rounded-xl p-4 border border-purple-500/30">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="w-5 h-5 text-purple-400" />
              <span className="text-sm text-gray-300">Monthly Spend</span>
            </div>
            <p className="text-2xl font-bold text-white">₹{totalMonthlySpend.toLocaleString()}</p>
          </div>
          <div className="bg-purple-900/40 rounded-xl p-4 border border-purple-500/30">
            <div className="flex items-center gap-2 mb-2">
              <Percent className="w-5 h-5 text-purple-400" />
              <span className="text-sm text-gray-300">Utilization</span>
            </div>
            <p className="text-2xl font-bold text-white">{utilizationPercentage}%</p>
            <p className={`text-xs font-medium mt-1 ${utilizationPercentage < 30 ? 'text-green-400' : 'text-pink-400'}`}>
              {utilizationPercentage < 30 ? 'Excellent!' : 'Consider reducing'}
            </p>
          </div>
        </div>
        <div className={`mt-4 p-4 ${utilizationPercentage < 30 ? 'bg-green-500/20 border border-green-400/30' : 'bg-pink-500/20 border border-pink-400/30'} rounded-xl`}>
          <p className="text-sm text-gray-200">
            <strong className={utilizationPercentage < 30 ? 'text-green-300' : 'text-pink-300'}>
              {utilizationPercentage < 30 ? 'Great job!' : 'Heads up!'}
            </strong> Your utilization is {utilizationPercentage < 30 ? 'below 30%' : 'above 30%'}, 
            which {utilizationPercentage < 30 ? 'positively impacts' : 'negatively impacts'} your credit score. Based on your spending patterns, 
            we've identified cards that will maximize your rewards.
          </p>
        </div>
      </div>

      {/* Recommendations */}
      <div className="space-y-6">
        <h2 className="text-2xl font-semibold text-white">Recommended Cards</h2>
        
        {recommendations.map((card, index) => (
          <div
            key={index}
            className="bg-purple-900/40 backdrop-blur-sm rounded-2xl border border-purple-500/30 overflow-hidden hover:shadow-lg hover:shadow-purple-500/50 transition-shadow"
          >
            <div className="md:flex">
              {/* Card Image */}
              <div className="md:w-1/3 relative">
                <img
                  src={card.image}
                  alt={card.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-4 right-4 bg-gradient-to-br from-purple-500 to-pink-500 text-white px-3 py-1 rounded-full font-bold text-sm">
                  {card.score}% Match
                </div>
              </div>

              {/* Card Details */}
              <div className="md:w-2/3 p-6">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="text-2xl font-bold text-white mb-1">{card.name}</h3>
                    <p className="text-sm text-gray-400">{card.issuer}</p>
                  </div>
                </div>

                <div className="bg-pink-500/20 border border-pink-400/30 rounded-lg p-3 mb-4">
                  <p className="text-sm text-gray-200">
                    <strong className="text-pink-300">Why this card?</strong> {card.reason}
                  </p>
                </div>

                {/* Key Features */}
                <div className="grid md:grid-cols-3 gap-4 mb-4">
                  <div>
                    <p className="text-xs text-gray-400 mb-1">Annual Fee</p>
                    <p className="font-semibold text-white">
                      {card.annualFee === 0 ? 'No Fee' : `₹${card.annualFee}`}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 mb-1">Signup Bonus</p>
                    <p className="font-semibold text-white">{card.signupBonus}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 mb-1">APR</p>
                    <p className="font-semibold text-white">{card.apr}</p>
                  </div>
                </div>

                {/* Benefits */}
                <div className="mb-4">
                  <p className="text-sm font-semibold text-white mb-2">Key Benefits:</p>
                  <ul className="space-y-1">
                    {card.benefits.map((benefit, idx) => (
                      <li key={idx} className="text-sm text-gray-300 flex items-start gap-2">
                        <span className="text-pink-400 mt-1">•</span>
                        <span>{benefit}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Actions */}
                <div className="flex gap-3">
                  <Button className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white">
                    Learn More
                    <ExternalLink className="ml-2 h-4 w-4" />
                  </Button>
                  <Button variant="outline" className="flex-1 border-2 border-purple-400 hover:bg-purple-500/20 text-white">
                    Compare Cards
                  </Button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Disclaimer */}
      <div className="bg-purple-900/30 border border-purple-500/30 rounded-xl p-4">
        <p className="text-xs text-gray-300">
          <strong>Disclaimer:</strong> These recommendations are based on your current profile and spending patterns. 
          Card approval depends on various factors including credit score, income, and issuer criteria. 
          Always read terms and conditions before applying. CredZen does not guarantee approval.
        </p>
      </div>
    </div>
  );
}