'use client';

import { motion } from 'motion/react';
import Image from 'next/image';

interface LogoLoadingProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function LogoLoading({ size = 'md', className = '' }: LogoLoadingProps) {
  const sizeClasses = {
    sm: 'w-12 h-12',
    md: 'w-16 h-16',
    lg: 'w-24 h-24',
  };

  const textSizeClasses = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg',
  };

  return (
    <div className={`flex flex-col items-center justify-center gap-4 ${className}`}>
      <motion.div
        className={`${sizeClasses[size]} relative`}
        animate={{
          scale: [1, 1.05, 1],
          opacity: [0.8, 1, 0.8],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      >
        <Image
          src="/images/seranote-logo-white.png"
          alt="Seranote Logo"
          width={size === 'sm' ? 48 : size === 'md' ? 64 : 96}
          height={size === 'sm' ? 48 : size === 'md' ? 64 : 96}
          className="w-full h-full object-contain"
          priority
        />
      </motion.div>
    </div>
  );
}
