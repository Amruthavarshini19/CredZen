import { useState } from 'react';
import { LandingPage } from '@/app/components/LandingPage';
import { UserDashboard } from '@/app/components/UserDashboard';

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  return (
    <div className="size-full">
      {!isLoggedIn ? (
        <LandingPage onLogin={() => setIsLoggedIn(true)} />
      ) : (
        <UserDashboard onLogout={() => setIsLoggedIn(false)} />
      )}
    </div>
  );
}