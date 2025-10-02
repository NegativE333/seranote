'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import Pusher from 'pusher-js';

const PusherContext = createContext<Pusher | null>(null);

export function PusherProvider({ children }: { children: React.ReactNode }) {
  const [pusher, setPusher] = useState<Pusher | null>(null);

  useEffect(() => {
    const pusherClient = new Pusher(process.env.NEXT_PUBLIC_PUSHER_KEY!, {
      cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER!,
      forceTLS: true,
    });

    setPusher(pusherClient);

    return () => {
      pusherClient.disconnect();
    };
  }, []);

  return (
    <PusherContext.Provider value={pusher}>
      {children}
    </PusherContext.Provider>
  );
}

export function usePusher() {
  const pusher = useContext(PusherContext);
  if (!pusher) {
    throw new Error('usePusher must be used within a PusherProvider');
  }
  return pusher;
}
