import { useState, useCallback, useEffect } from 'react';
import { usePlaidLink } from 'react-plaid-link';
import { Button } from './ui/button';
import { Landmark } from 'lucide-react';
import { toast } from 'sonner';

interface PlaidConnectProps {
  onConnected?: () => void;
  className?: string;
  children?: React.ReactNode;
}

export function PlaidConnect({ onConnected, className, children }: PlaidConnectProps) {
  const [token, setToken] = useState<string | null>(null);

  // 1. Create Link Token on mount
  useEffect(() => {
    async function createLinkToken() {
      try {
        const response = await fetch('http://localhost:3000/create_link_token', {
          method: 'POST',
        });
        const data = await response.json();
        setToken(data.link_token);
      } catch (err) {
        console.error('Error creating link token', err);
        toast.error('Failed to initialize bank connection');
      }
    }
    createLinkToken();
  }, []);

  // 2. Handle Success (Exchange public token)
  const onSuccess = useCallback(async (public_token: string) => {
    try {
      await fetch('http://localhost:3000/exchange_public_token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ public_token }),
      });
      toast.success('Bank connected successfully!');
      onConnected?.();
    } catch (err) {
      console.error('Error exchanging public token', err);
      toast.error('Failed to connect bank account');
    }
  }, [onConnected]);

  const config = {
    token,
    onSuccess,
  };

  const { open, ready } = usePlaidLink(config);

  return (
    <Button
      onClick={() => open()}
      disabled={!ready}
      className={className}
    >
      {children || (
        <>
          <Landmark className="w-5 h-5 mr-2" />
          Connect Bank
        </>
      )}
    </Button>
  );
}
