'use client';

import { AuroraBackground } from '../[components]/aurora-background';
import { SignInContent } from '../[components]/sign-in-animation';
import { motion } from 'motion/react';

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg text-gray-300 font-sans antialiased">
      <AuroraBackground />

      <main className="min-h-screen flex items-center justify-center relative z-10 p-4 lg:p-8">
        <div className="w-full max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center">
          <div className="hidden lg:flex items-center justify-center h-[600px]">
            <SignInContent />
          </div>
          <motion.div
            className="flex flex-col items-center justify-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
          >
            {children}
          </motion.div>
        </div>
      </main>
    </div>
  );
}
