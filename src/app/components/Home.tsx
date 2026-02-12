import { CreditCard, Brain, CheckCircle2, Calendar, AlertTriangle, Award, TrendingUp } from 'lucide-react';
import { PlaidConnect } from './PlaidConnect';
import { lessonsData } from './lessonData';

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
  onPlaidConnected?: (token: string) => void;
}

export function Home({ onNavigate, completedLessons = new Set(), cards = [], activities = [], onPlaidConnected }: HomeProps) {
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

  // Logic to calculate days remaining
  const getDaysRemaining = (dueDay: number) => {
    const today = new Date();
    const currentDay = today.getDate();
    const currentMonth = today.getMonth();
    const currentYear = today.getFullYear();

    // Create a date object for the due day in component's logic
    let dueDate = new Date(currentYear, currentMonth, dueDay);

    // If due day has passed this month, assume it's next month
    if (currentDay > dueDay) {
      dueDate = new Date(currentYear, currentMonth + 1, dueDay);
    }

    // Calculate difference in days
    const diffTime = dueDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    return diffDays;
  };

  // NEW: Billing Reminders Function
  const checkBillingReminders = (): string[] => {
    const reminders: string[] = [];
    cards.forEach(card => {
      const daysRemaining = getDaysRemaining(card.dueDay);
      if (daysRemaining >= 0 && daysRemaining <= 5) {
        if (daysRemaining === 0) {
          reminders.push(`🚨 PAYMENT DUE TODAY: ${card.name} (Ending in ${card.lastFour})`);
        } else {
          reminders.push(`⏰ Upcoming Due Date: ${card.name} in ${daysRemaining} day${daysRemaining > 1 ? 's' : ''}`);
        }
      }
    });
    return reminders;
  };

  const reminderMessages = checkBillingReminders();

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

      {/* Billing Cycle Section - New Feature */}
      <div className="bg-purple-900/40 backdrop-blur-sm rounded-2xl p-6 border border-purple-500/30">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg">
            <Calendar className="w-5 h-5 text-white" />
          </div>
          <h2 className="text-2xl font-semibold text-white">Billing Cycles</h2>
        </div>

        {/* Reminder Messages Section */}
        {reminderMessages.length > 0 && (
          <div className="mb-6 space-y-2">
            {reminderMessages.map((msg, idx) => (
              <div key={idx} className="flex items-center gap-2 p-3 bg-red-500/20 border border-red-500/50 rounded-xl text-red-100 text-sm font-medium animate-pulse">
                <AlertTriangle className="w-4 h-4 flex-shrink-0" />
                <span>{msg}</span>
              </div>
            ))}
          </div>
        )}

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {cards.map((card) => {
            const daysRemaining = getDaysRemaining(card.dueDay);
            const isDueSoon = daysRemaining <= 2 && daysRemaining >= 0;

            return (
              <div key={card.id} className={`p-4 rounded-xl border transition-all ${isDueSoon
                ? 'bg-red-500/10 border-red-500/50'
                : 'bg-white/5 border-purple-500/20'
                }`}>
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="font-semibold text-white">{card.name}</h3>
                    <p className="text-xs text-gray-400">{card.lastFour}</p>
                  </div>
                  {isDueSoon && (
                    <div className="flex items-center gap-1 text-red-400 bg-red-500/20 px-2 py-1 rounded-full">
                      <AlertTriangle className="w-3 h-3" />
                      <span className="text-xs font-bold">Due Soon</span>
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-2 mt-4 pt-3 border-t border-white/10">
                  <div className="bg-purple-500/10 p-2 rounded-lg text-center">
                    <p className="text-[10px] uppercase tracking-wider text-purple-300 mb-1">Billing Date</p>
                    <p className="text-sm font-bold text-white">{card.billingDay}th <span className="text-[10px] font-normal text-gray-400">/ mo</span></p>
                  </div>
                  <div className="bg-blue-500/10 p-2 rounded-lg text-center">
                    <p className="text-[10px] uppercase tracking-wider text-blue-300 mb-1">Due Date</p>
                    <p className={`text-sm font-bold ${isDueSoon ? 'text-red-400' : 'text-blue-200'}`}>
                      {card.dueDay}th <span className="text-[10px] font-normal text-gray-400">/ mo</span>
                    </p>
                  </div>
                </div>

                {isDueSoon && (
                  <p className="mt-2 text-xs text-red-300 text-center font-medium bg-red-900/20 py-1 rounded">
                    Payment due in {daysRemaining === 0 ? 'today' : `${daysRemaining} days`}!
                  </p>
                )}
              </div>
            );
          })}
        </div>
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
            <PlaidConnect
              onConnected={onPlaidConnected}
              className="w-full justify-start px-4 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-500 text-white hover:from-cyan-600 hover:to-blue-600 transition-all shadow-lg cursor-pointer h-auto text-base font-normal"
            />
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
