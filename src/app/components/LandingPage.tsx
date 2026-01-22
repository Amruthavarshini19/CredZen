import { useState } from 'react';
import { ArrowRight, CreditCard, Brain, Shield, TrendingUp, Lock, Award } from 'lucide-react';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/app/components/ui/dialog';

interface LandingPageProps {
  onLogin: (mobileNumber: string) => void;
}

export function LandingPage({ onLogin }: LandingPageProps) {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'features'>('dashboard');
  const [showLoginDialog, setShowLoginDialog] = useState(false);
  const [loginInput, setLoginInput] = useState('');

  const features = [
    {
      icon: <Brain className="w-8 h-8 text-purple-600" />,
      title: 'Smart Learning',
      description: 'Learn credit card management through interactive, gamified lessons'
    },
    {
      icon: <CreditCard className="w-8 h-8 text-purple-600" />,
      title: 'Card Management',
      description: 'Track and manage all your credit cards in one secure place'
    },
    {
      icon: <TrendingUp className="w-8 h-8 text-purple-600" />,
      title: 'Smart Recommendations',
      description: 'AI-powered card suggestions based on your spending patterns'
    },
    {
      icon: <Shield className="w-8 h-8 text-purple-600" />,
      title: 'Credit Score Insights',
      description: 'Understand and improve your credit score with personalized tips'
    },
    {
      icon: <Award className="w-8 h-8 text-purple-600" />,
      title: 'Rewards Optimization',
      description: 'Maximize your rewards and benefits across all your cards'
    },
    {
      icon: <Lock className="w-8 h-8 text-purple-600" />,
      title: 'Secure & Private',
      description: 'Bank-level security to protect your financial information'
    }
  ];

  const handleLogin = () => {
    if (loginInput.trim()) {
      onLogin(loginInput.trim());
      setLoginInput('');
      setShowLoginDialog(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-black">
      {/* Header */}
      <header className="border-b border-purple-500/30 bg-black/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <div className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              CredZen
            </div>

            {/* Navigation Tabs */}
            <nav className="flex items-center gap-8">
              <button
                onClick={() => setActiveTab('dashboard')}
                className={`text-lg transition-colors ${
                  activeTab === 'dashboard'
                    ? 'text-white font-semibold'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                Dashboard
              </button>
              <button
                onClick={() => setActiveTab('features')}
                className={`text-lg transition-colors ${
                  activeTab === 'features'
                    ? 'text-white font-semibold'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                Features
              </button>
              <Button
                onClick={() => setShowLoginDialog(true)}
                className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white"
              >
                Get Started
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-16">
        {activeTab === 'dashboard' ? (
          <div className="space-y-8">
            {/* Hero Section */}
            <div className="text-center space-y-6 max-w-4xl mx-auto">
              <h1 className="text-7xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400 bg-clip-text text-transparent">
                CredZen
              </h1>
              <p className="text-2xl text-white leading-relaxed">
                Master Your Credit Card Journey with Confidence
              </p>
              <p className="text-lg text-gray-300 max-w-3xl mx-auto">
                CredZen is your intelligent companion for credit card learning and management. 
                We combine gamified education with smart AI recommendations to help you make 
                informed decisions about credit cards, optimize rewards, and build a strong 
                financial foundation.
              </p>
            </div>

            {/* Benefits Section */}
            <div className="grid md:grid-cols-3 gap-6 mt-16">
              <div className="bg-purple-900/40 backdrop-blur-sm rounded-2xl p-8 border border-purple-500/30 shadow-sm hover:shadow-lg hover:border-purple-400 transition-shadow">
                <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center mb-4">
                  <Brain className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-3">Learn at Your Pace</h3>
                <p className="text-gray-300">
                  Progress through bite-sized lessons designed to build your credit card knowledge step by step.
                </p>
              </div>

              <div className="bg-purple-900/40 backdrop-blur-sm rounded-2xl p-8 border border-purple-500/30 shadow-sm hover:shadow-lg hover:border-purple-400 transition-shadow">
                <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center mb-4">
                  <TrendingUp className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-3">Smart Insights</h3>
                <p className="text-gray-300">
                  Get personalized card recommendations based on your spending habits and financial goals.
                </p>
              </div>

              <div className="bg-purple-900/40 backdrop-blur-sm rounded-2xl p-8 border border-purple-500/30 shadow-sm hover:shadow-lg hover:border-purple-400 transition-shadow">
                <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center mb-4">
                  <Award className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-3">Maximize Rewards</h3>
                <p className="text-gray-300">
                  Discover how to optimize your credit card usage to earn maximum rewards and benefits.
                </p>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-8">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-white mb-4">Platform Features</h2>
              <p className="text-lg text-gray-300">
                Everything you need to become a credit card expert
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {features.map((feature, index) => (
                <div
                  key={index}
                  className="bg-purple-900/40 backdrop-blur-sm rounded-2xl p-8 border border-purple-500/30 shadow-sm hover:shadow-lg hover:border-purple-400 transition-all duration-300 group"
                >
                  <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-3">{feature.title}</h3>
                  <p className="text-gray-300">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      {/* Login Dialog */}
      <Dialog open={showLoginDialog} onOpenChange={setShowLoginDialog}>
        <DialogContent className="bg-gradient-to-br from-gray-900 to-purple-900 border-purple-500/50">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-white">Welcome to CredZen</DialogTitle>
            <DialogDescription className="text-gray-300">
              Enter your email or phone number to get started with your credit card learning journey.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 mt-4">
            <div>
              <Input
                type="text"
                placeholder="Email or Phone Number"
                value={loginInput}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setLoginInput(e.target.value)}
                onKeyPress={(e: React.KeyboardEvent<HTMLInputElement>) => e.key === 'Enter' && handleLogin()}
                className="bg-black/30 border-purple-500/50 text-white placeholder:text-gray-400"
              />
            </div>
            <Button
              onClick={handleLogin}
              className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white"
            >
              Log In
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}