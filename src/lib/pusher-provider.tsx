'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import Pusher from 'pusher-js';

const PusherContext = createContext<{ pusher: Pusher | null; isLoading: boolean }>({
  pusher: null,
  isLoading: true,
});

export function PusherProvider({ children }: { children: React.ReactNode }) {
  const [pusher, setPusher] = useState<Pusher | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if we're in the browser and have the required environment variables
    if (typeof window === 'undefined') {
      setIsLoading(false);
      return;
    }

    const pusherKey = process.env.NEXT_PUBLIC_PUSHER_KEY;
    const pusherCluster = process.env.NEXT_PUBLIC_PUSHER_CLUSTER;

    if (!pusherKey || !pusherCluster) {
      console.warn('Pusher environment variables not set. Real-time features will be disabled.');
      setIsLoading(false);
      return;
    }

    try {
      const pusherClient = new Pusher(pusherKey, {
        cluster: pusherCluster,
        forceTLS: true,
      });

      setPusher(pusherClient);
      setIsLoading(false);
    } catch (error) {
      console.error('Failed to initialize Pusher:', error);
      setIsLoading(false);
    }

    return () => {
      if (pusher) {
        pusher.disconnect();
      }
    };
  }, []);

  return <PusherContext.Provider value={{ pusher, isLoading }}>{children}</PusherContext.Provider>;
}

export function usePusher() {
  const { pusher, isLoading } = useContext(PusherContext);

  if (isLoading) {
    return null; // Return null while loading instead of throwing an error
  }

  return pusher;
}
