'use client';

import { Toaster } from '@/components/ui/sonner';
import { AuroraBackground } from '../[components]/aurora-background';
import { Sidebar } from '../[components]/sidebar';

export default function AuthorizedLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg text-gray-300 font-sans antialiased">
      <AuroraBackground />
      <Sidebar />

      <main className="relative z-10 ml-64">
        <div className="p-8">
          <div>{children}</div>
        </div>
      </main>
      <Toaster position="top-right" style={{ zIndex: 9999 }} />
    </div>
  );
}
