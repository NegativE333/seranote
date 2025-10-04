'use client';

import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { AuroraBackground } from './[components]/aurora-background';
import { useUser } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import { Sidebar } from './[components]/sidebar';
import Image from 'next/image';

export default function HomePage() {
  const { isSignedIn, isLoaded } = useUser();

  const router = useRouter();

  useEffect(() => {
    if (isLoaded && isSignedIn) {
      router.push('/overview');
    }
  }, [isLoaded, isSignedIn, router]);

  if (!isLoaded) {
    return (
      <div className="min-h-screen text-gray-300 font-sans antialiased overflow-hidden">
        <AuroraBackground />
        <div className="min-h-screen flex items-center justify-center relative z-10">
          <Sidebar />
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto"></div>
          </div>
        </div>
      </div>
    );
  }

  if (isSignedIn) {
    return null;
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.2, delayChildren: 0.5 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 1 },
    },
  };

  return (
    <div className="min-h-screen text-gray-300 font-sans antialiased overflow-hidden">
      <AuroraBackground />
      <motion.header
        className="fixed top-0 left-0 right-0 z-50 bg-black/10 backdrop-blur-md border-b border-white/10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 0.2 }}
      >
        <div className="container mx-auto px-6 py-5 flex justify-between items-center">
          <div className="flex items-end">
            <Image
              src="/images/seranote-logo.png"
              alt="SERANOTE"
              width={100}
              height={100}
              className="w-8 h-8"
            />
            <h2 className="text-2xl font-medium text-white/90 leading-none">
              <span className="bg-gradient-to-r from-[#E040BB] to-[#7127BA] text-transparent bg-clip-text">
                eranote
              </span>
            </h2>
          </div>
          <div className="flex items-center gap-4">
            <motion.button
              className="border border-white/20 text-white/80 font-medium py-2 px-5 rounded-full text-sm hover:bg-white/10 transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Link href="/sign-in">Sign In</Link>
            </motion.button>
            <motion.button
              className="border border-white/20 text-white/80 font-medium py-2 px-5 rounded-full text-sm hover:bg-white/10 transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Link href="/sign-up">Sign Up</Link>
            </motion.button>
          </div>
        </div>
      </motion.header>

      <main className="min-h-screen flex items-center justify-center relative z-10 px-6">
        <motion.div
          className="text-center max-w-3xl mx-auto"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.h1
            className="text-5xl md:text-7xl font-bold text-transparent bg-clip-text bg-gradient-to-br from-white to-white/60 leading-tight tracking-tight mb-8"
            variants={itemVariants}
          >
            Where feelings find their soundtrack.
          </motion.h1>
          <motion.p
            className="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto mb-12"
            variants={itemVariants}
          >
            Anonymously write what's in your heart. Pair it with the perfect song. Share it with a
            single link.
          </motion.p>
          <motion.div variants={itemVariants}>
            <motion.button
              className="bg-white text-black font-bold py-4 px-10 rounded-full text-lg shadow-2xl shadow-white/20"
              whileHover={{
                scale: 1.05,
                boxShadow: '0px 0px 30px rgba(255, 255, 255, 0.3)',
              }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: 'spring', stiffness: 300, damping: 20 }}
            >
              <Link href="/sign-up">Get Started</Link>
            </motion.button>
          </motion.div>
        </motion.div>
      </main>
    </div>
  );
}
