import { useState } from 'react';
import { User, Wallet as WalletIcon, Settings, LogOut, ChevronDown, Home as HomeIcon, GraduationCap, Sparkles } from 'lucide-react';
import { Button } from '@/app/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/app/components/ui/dropdown-menu';
import { Home } from '@/app/components/Home';
import { Learn } from '@/app/components/Learn';
import { SmartPick } from '@/app/components/SmartPick';
import { Wallet } from '@/app/components/Wallet';
import { SettingsPage } from '@/app/components/SettingsPage';

interface UserDashboardProps {
  onLogout: () => void;
}

export function UserDashboard({ onLogout }: UserDashboardProps) {
  const [activePage, setActivePage] = useState<'home' | 'learn' | 'smartpick' | 'wallet' | 'settings'>('home');

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-black">
      {/* Top Navigation Bar */}
      <header className="border-b border-purple-500/30 bg-black/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <div className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              CredZen
            </div>

            {/* Profile Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="flex items-center gap-2 hover:bg-purple-500/20 text-white">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-400 to-pink-500 flex items-center justify-center shadow-lg">
                    <User className="w-5 h-5 text-white" />
                  </div>
                  <ChevronDown className="w-4 h-4 text-gray-300" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48 bg-gray-900/95 backdrop-blur-sm border-purple-500/50">
                <DropdownMenuItem onClick={() => setActivePage('wallet')} className="cursor-pointer hover:bg-purple-500/20 text-gray-200 focus:bg-purple-500/20 focus:text-white">
                  <WalletIcon className="mr-2 h-4 w-4" />
                  <span>Wallet</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setActivePage('settings')} className="cursor-pointer hover:bg-purple-500/20 text-gray-200 focus:bg-purple-500/20 focus:text-white">
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Settings</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={onLogout} className="cursor-pointer hover:bg-red-500/20 text-red-400 focus:bg-red-500/20 focus:text-red-300">
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Logout</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>

      <div className="flex max-w-7xl mx-auto">
        {/* Sidebar Navigation */}
        <aside className="w-72 min-h-[calc(100vh-73px)] border-r border-purple-500/30 bg-black/30 backdrop-blur-sm p-6">
          <div className="bg-gradient-to-br from-purple-800/40 to-pink-800/40 rounded-2xl p-4 border border-purple-400/30 shadow-lg">
            <nav className="space-y-2">
              <button
                onClick={() => setActivePage('home')}
                className={`w-full text-left px-4 py-3 rounded-xl transition-all duration-200 flex items-center gap-3 ${
                  activePage === 'home'
                    ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg shadow-purple-500/50'
                    : 'text-gray-300 hover:bg-purple-500/20 hover:text-white'
                }`}
              >
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                  activePage === 'home'
                    ? 'bg-white/20'
                    : 'bg-purple-500/20'
                }`}>
                  <HomeIcon className="w-5 h-5" />
                </div>
                <span className="font-semibold">Home</span>
              </button>
              <button
                onClick={() => setActivePage('learn')}
                className={`w-full text-left px-4 py-3 rounded-xl transition-all duration-200 flex items-center gap-3 ${
                  activePage === 'learn'
                    ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg shadow-purple-500/50'
                    : 'text-gray-300 hover:bg-purple-500/20 hover:text-white'
                }`}
              >
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                  activePage === 'learn'
                    ? 'bg-white/20'
                    : 'bg-purple-500/20'
                }`}>
                  <GraduationCap className="w-5 h-5" />
                </div>
                <span className="font-semibold">Learn</span>
              </button>
              <button
                onClick={() => setActivePage('smartpick')}
                className={`w-full text-left px-4 py-3 rounded-xl transition-all duration-200 flex items-center gap-3 ${
                  activePage === 'smartpick'
                    ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg shadow-purple-500/50'
                    : 'text-gray-300 hover:bg-purple-500/20 hover:text-white'
                }`}
              >
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                  activePage === 'smartpick'
                    ? 'bg-white/20'
                    : 'bg-purple-500/20'
                }`}>
                  <Sparkles className="w-5 h-5" />
                </div>
                <span className="font-semibold">Smart Pick</span>
              </button>
            </nav>
          </div>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 p-8">
          {activePage === 'home' && <Home />}
          {activePage === 'learn' && <Learn />}
          {activePage === 'smartpick' && <SmartPick />}
          {activePage === 'wallet' && <Wallet />}
          {activePage === 'settings' && <SettingsPage />}
        </main>
      </div>
    </div>
  );
}