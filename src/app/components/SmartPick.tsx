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

import { useState, useEffect } from 'react';

export interface Transaction {
  date: string;
  merchant: string;
  amount: number;
  category: string;
  category_label: string;
  card: string;
}

interface AnalysisResult {
  top_spending_categories: { category: string; amount: number; percentage: number }[];
  spending_insights: string[];
  smart_card_usage_advice: string;
  reward_optimization_tips: string[];
  potential_rewards?: Record<string, number>;
}

interface SmartPickProps {
  cards?: Card[];
  transactions?: Transaction[];
}

export function SmartPick({ cards = [], transactions = [] }: SmartPickProps) {
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (transactions.length > 0) {
      setLoading(true);
      setError(''); // Clear previous errors
      fetch('http://localhost:8000/api/smart-pick/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          transactions: transactions.slice(0, 50),
          cards: cards
        }),
      })
        .then(res => {
          if (!res.ok) throw new Error('Analysis failed');
          return res.json();
        })
        .then(data => setAnalysis(data))
        .catch(err => {
          console.error(err);
          setError('Failed to load AI insights');
        })
        .finally(() => setLoading(false));
    }
  }, [transactions, cards]);

  // Calculate totals from user's cards
  const totalCreditLimit = cards.length > 0
    ? cards.reduce((sum, card) => sum + card.limit, 0)
    : 5000;

  const totalCreditBalance = cards.length > 0
    ? cards.reduce((sum, card) => sum + card.balance, 0)
    : 1200;

  const utilizationPercentage = totalCreditLimit > 0
    ? Math.round((totalCreditBalance / totalCreditLimit) * 100)
    : 24;

  const totalMonthlySpend = cards.length > 0
    ? cards.reduce((sum, card) => sum + card.balance, 0)
    : 1200;

  const recommendations = [
    {
      name: 'Chase Sapphire Preferred',
      issuer: 'Chase',
      score: 95,
      reason: 'Excellent for travel and dining with 4x points on both.',
      annualFee: 95,
      signupBonus: '60,000 points',
      apr: '21.49% - 28.49%',
      benefits: [
        '4% rewards on Travel and Dining',
        '2% on Shopping',
        '1% on all other purchases',
        'No foreign transaction fees'
      ],
      image: 'https://images.unsplash.com/photo-1559526324-593bc073d938?w=400&q=80'
    },
    {
      name: 'Regions Premium Cashback',
      issuer: 'Regions',
      score: 92,
      reason: 'Top-tier 5% cashback on dining, shopping, and bills.',
      annualFee: 0,
      signupBonus: '₹200 cashback',
      apr: '19.99% - 29.99%',
      benefits: [
        '5% cashback on Dining, Shopping, and Bills',
        '2% on Fuel and Travel',
        'No annual fee',
        'Simple redemption options'
      ],
      image: 'https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=400&q=80'
    },
    {
      name: 'Bank of America Customized Cash',
      issuer: 'Bank of america',
      score: 88,
      reason: 'Perfect for Amazon shoppers with 5% rewards on shopping.',
      annualFee: 0,
      signupBonus: '₹200 bonus',
      apr: '18.24% - 28.24%',
      benefits: [
        '5% rewards on Shopping (including Amazon)',
        '2% on Dining, Fuel, and Bills',
        'No annual fee',
        'Low introductory APR'
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



      {/* AI Analysis Section */}
      <div className="bg-gradient-to-r from-indigo-900/40 to-purple-900/40 backdrop-blur-sm rounded-2xl p-6 border border-indigo-500/30">
        <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-indigo-400" />
          AI Financial Insights
        </h2>

        {transactions.length === 0 ? (
          <div className="text-center py-6 text-gray-400">
            <p>No recent transactions found to analyze.</p>
            <p className="text-sm mt-2">Connect your cards to get personalized AI insights.</p>
          </div>
        ) : loading ? (
          <div className="text-center py-8 text-gray-400 animate-pulse">Analyzing your transactions...</div>
        ) : error ? (
          <div className="text-red-400 text-sm mt-2 bg-red-500/10 p-4 rounded-xl border border-red-500/20">{error}</div>
        ) : analysis ? (
          <div className="space-y-6">
            {/* Insights & Advice */}
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-black/20 rounded-xl p-4">
                <h3 className="text-lg font-medium text-purple-300 mb-2">Spending Insights</h3>
                <ul className="space-y-2">
                  {analysis.spending_insights.map((insight, i) => (
                    <li key={i} className="text-gray-300 text-sm flex gap-2">
                      <span className="text-purple-500">•</span> {insight}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="bg-black/20 rounded-xl p-4">
                <h3 className="text-lg font-medium text-pink-300 mb-2">Optimization Tips</h3>
                <ul className="space-y-2">
                  {analysis.reward_optimization_tips.map((tip, i) => (
                    <li key={i} className="text-gray-300 text-sm flex gap-2">
                      <span className="text-pink-500">•</span> {tip}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* AI Highlight Recommendation */}
            <div className="bg-gradient-to-r from-indigo-500/20 to-purple-500/20 border-2 border-indigo-500/50 rounded-2xl p-6 shadow-xl relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                <Brain className="w-24 h-24" />
              </div>
              <div className="relative z-10">
                <div className="flex items-center gap-2 mb-4">
                  <span className="bg-indigo-500 text-white text-[10px] font-black uppercase tracking-widest px-2 py-1 rounded">AI Choice</span>
                  <h3 className="text-xl font-bold text-white">Recommended for your NEXT Spend</h3>
                </div>
                <p className="text-lg text-indigo-100 leading-relaxed mb-4">
                  {analysis.smart_card_usage_advice}
                </p>
                <div className="flex items-center gap-4 text-sm">
                  <div className="px-3 py-1.5 bg-indigo-500/30 rounded-lg text-indigo-200 border border-indigo-400/30">
                    Category Winner: <span className="text-white font-bold">{analysis.top_spending_categories[0]?.category}</span>
                  </div>
                  <div className="px-3 py-1.5 bg-green-500/30 rounded-lg text-green-200 border border-green-400/30">
                    Impact: <span className="text-white font-bold">Max Reward Rate</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Top Categories */}
            <div>
              <h3 className="text-sm uppercase tracking-wider text-gray-400 mb-3">Top Spending Categories</h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {analysis.top_spending_categories.map((cat, i) => (
                  <div key={i} className="bg-white/5 rounded-lg p-3 text-center">
                    <div className="text-indigo-400 font-bold text-lg">{cat.percentage}%</div>
                    <div className="text-gray-300 text-sm truncate">{cat.category}</div>
                    <div className="text-gray-500 text-xs">₹{cat.amount.toLocaleString()}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : null}
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
                <div className="absolute top-4 right-4 flex flex-col items-end gap-2">
                  <div className="bg-gradient-to-br from-purple-500 to-pink-500 text-white px-3 py-1 rounded-full font-bold text-sm shadow-xl">
                    {card.score}% Match
                  </div>
                  {analysis?.potential_rewards?.[card.issuer] !== undefined && (
                    <div className="bg-green-500 text-white px-3 py-1 rounded-full font-black text-xs shadow-xl animate-bounce">
                      +₹{Math.round(analysis.potential_rewards[card.issuer])} Rewards
                    </div>
                  )}
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
    </div >
  );
}