'use client';

import { useState, useEffect } from 'react';
import { Toaster } from '@/components/ui/sonner';
import { AuroraBackground } from '../[components]/aurora-background';
import { Sidebar } from '../[components]/sidebar';
import { MenuIcon, XIcon } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';

export default function AuthorizedLayout({ children }: { children: React.ReactNode }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024); // lg breakpoint
      if (window.innerWidth >= 1024) {
        setIsSidebarOpen(false); // Reset state on desktop
      }
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  return (
    <div className="min-h-screen bg text-gray-300 font-sans antialiased">
      <AuroraBackground />

      {/* Mobile Top Navbar */}
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className="fixed top-0 left-0 right-0 z-[60] lg:hidden bg-black/30 backdrop-blur-lg border-b border-white/10 px-4 py-3 flex items-center justify-between"
      >
        {/* Logo */}
        <div className="flex items-end">
          <Image
            src="/images/seranote-logo-white.png"
            alt="SERANOTE"
            width={100}
            height={100}
            className="w-6 h-6"
          />
          <h2 className="text-xl font-medium text-white/90 leading-none mt-2">eranote</h2>
        </div>

        {/* Menu Toggle Button */}
        <button
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="bg-white/10 hover:bg-white/20 p-2 rounded-lg text-white transition-colors"
          aria-label="Toggle menu"
        >
          {isSidebarOpen ? <XIcon className="w-6 h-6" /> : <MenuIcon className="w-6 h-6" />}
        </button>
      </motion.nav>

      {/* Mobile Overlay */}
      <AnimatePresence>
        {isSidebarOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => setIsSidebarOpen(false)}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
            />
          </>
        )}
      </AnimatePresence>

      <Sidebar
        isOpen={isMobile ? isSidebarOpen : undefined}
        onClose={isMobile ? () => setIsSidebarOpen(false) : undefined}
      />

      <main className="relative z-10 lg:ml-64 pt-16 lg:pt-0">
        <div className="p-4 sm:p-6 lg:px-6 lg:py-4">
          <div>{children}</div>
        </div>
      </main>
      <Toaster position="top-right" offset={isMobile ? 64 : 16} style={{ zIndex: 9999 }} />
    </div>
  );
}
