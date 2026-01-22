import { CreditCard, Brain, TrendingUp, Award, CheckCircle2 } from 'lucide-react';
import { lessonsData } from './lessonData';

interface Card {
  id: number;
  name: string;
  lastFour: string;
  type: string;
  limit: number;
  balance: number;
  color: string;
}

interface Activity {
  id: string;
  title: string;
  timestamp: number;
}

interface HomeProps {
  onNavigate?: (page: 'learn' | 'smartpick' | 'wallet') => void;
  completedLessons?: Set<number>;
  cards?: Card[];
  activities?: Activity[];
}

export function Home({ onNavigate, completedLessons = new Set(), cards = [], activities = [] }: HomeProps) {
  // Calculate learning progress based on completed lessons
  const totalXP = Array.from(completedLessons).reduce((sum, lessonId) => {
    const lesson = lessonsData.find(l => l.id === lessonId);
    return sum + (lesson?.xp || 0);
  }, 0);

  const maxXP = lessonsData.reduce((sum, l) => sum + l.xp, 0);
  const learningProgressPercent = (totalXP / maxXP) * 100;

  const stats = [
    { label: 'Learning Progress', value: `${Math.round(learningProgressPercent)}%`, icon: <Brain className="w-5 h-5" /> },
    { label: 'Cards Managed', value: cards.length.toString(), icon: <CreditCard className="w-5 h-5" /> },
    { label: 'Rewards Earned', value: '₹248', icon: <Award className="w-5 h-5" /> },
    { label: 'Credit Score', value: '742', icon: <TrendingUp className="w-5 h-5" /> }
  ];

  // Format time difference
  const formatTimeAgo = (timestamp: number): string => {
    const now = Date.now();
    const diff = now - timestamp;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
    if (hours < 24) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    if (days < 7) return `${days} day${days > 1 ? 's' : ''} ago`;
    return new Date(timestamp).toLocaleDateString();
  };

  // Sort activities by most recent first and limit to 1
  const recentActivities = activities
    .sort((a, b) => b.timestamp - a.timestamp)
    .slice(0, 1)
    .map(activity => ({
      title: activity.title,
      time: formatTimeAgo(activity.timestamp)
    }));

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="bg-purple-900/40 backdrop-blur-sm rounded-2xl p-8 border border-purple-500/30">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mb-3">
          Welcome to CredZen
        </h1>
        <p className="text-lg text-white mb-6">
          Your intelligent platform for credit card learning and management
        </p>
        <p className="text-gray-300 leading-relaxed">
          CredZen helps you master credit card management through interactive learning modules, 
          smart AI-powered recommendations, and comprehensive card tracking. Build your financial 
          literacy, optimize your rewards, and make informed decisions about credit cards.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <div
            key={index}
            className="bg-purple-900/40 backdrop-blur-sm rounded-xl p-6 border border-purple-500/30 hover:shadow-lg hover:border-purple-400 transition-shadow"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-400">{stat.label}</span>
              <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center text-white">
                {stat.icon}
              </div>
            </div>
            <p className="text-3xl font-bold text-white">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Two Column Layout */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Quick Actions */}
        <div className="bg-purple-900/40 backdrop-blur-sm rounded-2xl p-6 border border-purple-500/30">
          <h2 className="text-2xl font-semibold text-white mb-4">Quick Actions</h2>
          <div className="space-y-3">
            <button 
              onClick={() => onNavigate?.('learn')}
              className="w-full text-left px-4 py-3 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:from-purple-600 hover:to-pink-600 transition-all shadow-lg cursor-pointer">
              Continue Learning
            </button>
            <button 
              onClick={() => onNavigate?.('smartpick')}
              className="w-full text-left px-4 py-3 rounded-xl bg-gradient-to-r from-pink-500 to-purple-500 text-white hover:from-pink-600 hover:to-purple-600 transition-all shadow-lg cursor-pointer">
              View Card Recommendations
            </button>
            <button 
              onClick={() => onNavigate?.('wallet')}
              className="w-full text-left px-4 py-3 rounded-xl border-2 border-purple-400 text-gray-200 hover:bg-purple-500/20 transition-all cursor-pointer">
              Manage Cards
            </button>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-purple-900/40 backdrop-blur-sm rounded-2xl p-6 border border-purple-500/30">
          <h2 className="text-2xl font-semibold text-white mb-4">Recent Activity</h2>
          <div className="space-y-3">
            {recentActivities.length > 0 ? (
              recentActivities.map((activity, index) => (
                <div key={index} className="flex items-start gap-3 p-3 rounded-lg hover:bg-purple-500/20 transition-colors">
                  <CheckCircle2 className="w-5 h-5 text-pink-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-white font-medium">{activity.title}</p>
                    <p className="text-sm text-gray-400">{activity.time}</p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-400 text-center py-4">No activities yet. Start learning or add a card!</p>
            )}
          </div>
        </div>
      </div>

      {/* Usage Tips */}
      <div className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 backdrop-blur-sm rounded-2xl p-6 border border-purple-400/50">
        <h3 className="text-xl font-semibold text-white mb-3">💡 How to Use CredZen</h3>
        <ul className="space-y-2 text-gray-200">
          <li className="flex items-start gap-2">
            <span className="text-pink-400 font-bold">•</span>
            <span><strong className="text-white">Home:</strong> View your dashboard with stats and quick actions</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-pink-400 font-bold">•</span>
            <span><strong className="text-white">Learn:</strong> Complete gamified lessons to build credit card knowledge</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-pink-400 font-bold">•</span>
            <span><strong className="text-white">Smart Pick:</strong> Get AI-powered card recommendations based on your profile</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-pink-400 font-bold">•</span>
            <span><strong className="text-white">Wallet:</strong> Manage your credit cards and view details</span>
          </li>
        </ul>
      </div>
    </div>
  );
}
