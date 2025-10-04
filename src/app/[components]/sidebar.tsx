'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  PlusIcon,
  InboxIcon,
  SettingsIcon,
  UserCog,
  LogOut,
  SendIcon,
} from 'lucide-react';
// Import the useUser and useClerk hooks
import { useUser, useClerk } from '@clerk/nextjs';
import Image from 'next/image';

export const Sidebar = () => {
  const router = useRouter();
  const pathname = usePathname();
  const { user, isLoaded } = useUser();
  const { signOut, openUserProfile } = useClerk();

  // State to manage the custom popover visibility
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  const popoverRef = useRef<HTMLDivElement>(null);

  // Close popover when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (popoverRef.current && !popoverRef.current.contains(event.target as Node)) {
        setIsPopoverOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const NavItem = ({
    label,
    icon,
    path,
  }: {
    label: string;
    icon: React.ReactNode;
    path: string;
  }) => (
    <button
      onClick={() => router.push(path)}
      className={`flex items-center w-full text-left px-4 py-2.5 rounded-lg transition-colors duration-200 ${
        pathname === path
          ? 'bg-white/10 text-white'
          : 'text-gray-400 hover:bg-white/5 hover:text-white'
      }`}
    >
      <div className="mr-3">{icon}</div>
      <span className="text-sm font-medium">{label}</span>
    </button>
  );

  return (
    <aside className="fixed top-0 left-0 h-full w-64 bg-black/30 backdrop-blur-lg border-r border-white/10 p-4 flex flex-col">
      <div className="flex items-end mb-8">
        <Image
          src="/images/seranote-logo-white.png"
          alt="SERANOTE"
          width={100}
          height={100}
          className="w-7 h-7"
        />
        <h2 className="text-2xl font-medium text-white/90 leading-none">eranote</h2>
      </div>

      <motion.button
        className="w-full bg-white text-black font-semibold py-2.5 px-4 rounded-lg text-sm flex items-center justify-center gap-2 mb-8"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => router.push('/create')}
      >
        <PlusIcon className="w-5 h-5" />
        New Note
      </motion.button>

      <nav className="flex flex-col gap-2">
        <NavItem label="Sent Notes" icon={<SendIcon className="w-5 h-5" />} path="/notes" />
        <NavItem label="Received Notes" icon={<InboxIcon className="w-5 h-5" />} path="/received" />
      </nav>

      <div className="mt-auto">
        <NavItem label="Settings" icon={<SettingsIcon className="w-5 h-5" />} path="/settings" />
        <div className="border-t border-white/10 my-4"></div>

        {/* Custom User Profile Section */}
        <div className="relative" ref={popoverRef}>
          <button
            className="flex items-center gap-3 px-2 py-2 w-full text-left rounded-lg hover:bg-white/5 transition-colors"
            onClick={() => setIsPopoverOpen(!isPopoverOpen)}
          >
            <div className="w-9 h-9 bg-gradient-to-br from-purple-600 to-pink-600 rounded-full flex items-center justify-center text-white text-xl font-semibold flex-shrink-0">
              {user?.firstName?.charAt(0)}
            </div>
            <div className="max-w-[80%]">
              {isLoaded && user ? (
                <>
                  <p className="text-sm font-medium text-white/90 truncate">
                    {user.fullName || 'User'}
                  </p>
                  <p className="text-xs text-gray-500 truncate">
                    {user.emailAddresses[0].emailAddress}
                  </p>
                </>
              ) : (
                <div className="space-y-1">
                  <div className="w-24 h-4 bg-white/10 rounded"></div>
                  <div className="w-16 h-3 bg-white/10 rounded"></div>
                </div>
              )}
            </div>
          </button>

          {/* Custom Popover */}
          <AnimatePresence>
            {isPopoverOpen && (
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                transition={{ duration: 0.2, ease: 'easeOut' }}
                className="absolute bottom-full left-0 mb-2 w-full bg-black/90 border border-white/10 text-white backdrop-blur-xl shadow-2xl shadow-black/40 rounded-lg p-2"
              >
                <button
                  onClick={() => {
                    openUserProfile();
                    setIsPopoverOpen(false);
                  }}
                  className="flex items-center w-full text-left px-3 py-2 text-sm rounded-md text-white/80 hover:bg-white/5"
                >
                  <UserCog className="w-4 h-4 mr-2 text-purple-400" />
                  Manage Account
                </button>
                <button
                  onClick={() => signOut(() => router.push('/'))}
                  className="flex items-center w-full text-left px-3 py-2 text-sm rounded-md text-white/80 hover:bg-white/5"
                >
                  <LogOut className="w-4 h-4 mr-2 text-purple-400" />
                  Sign Out
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </aside>
  );
};
