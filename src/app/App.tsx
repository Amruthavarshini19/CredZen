import { useState, createContext, useEffect } from 'react';
import { LandingPage } from '@/app/components/LandingPage';
import { UserDashboard } from '@/app/components/UserDashboard';

export const UserDashboardContext = createContext<{
  setActivePage?: (page: 'home' | 'learn' | 'smartpick' | 'wallet' | 'tracker' | 'settings') => void;
} | null>(null);

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userMobileNumber, setUserMobileNumber] = useState('');

  useEffect(() => {
    // Check if user was previously logged in
    const savedMobileNumber = localStorage.getItem('credzen_user_mobile');
    if (savedMobileNumber) {
      setUserMobileNumber(savedMobileNumber);
      setIsLoggedIn(true);
    }
  }, []);

  const handleLogin = (mobileNumber: string) => {
    setUserMobileNumber(mobileNumber);
    localStorage.setItem('credzen_user_mobile', mobileNumber);
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    setUserMobileNumber('');
    localStorage.removeItem('credzen_user_mobile');
    setIsLoggedIn(false);
  };

  return (
    <div className="size-full">
      {!isLoggedIn ? (
        <LandingPage onLogin={handleLogin} />
      ) : (
        <UserDashboard onLogout={handleLogout} userMobileNumber={userMobileNumber} />
      )}
    </div>
  );
}