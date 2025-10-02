'use client';
import { motion } from 'motion/react';
import { Skeleton } from '@/components/ui/skeleton';
import { ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function LoadingComponent() {
  const router = useRouter();
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="max-w-4xl"
    >
      <button
        onClick={() => router.back()}
        className="flex items-center gap-2 text-gray-400 hover:text-white mb-6 transition-colors"
      >
        <ArrowLeft className="w-5 h-5" />
        Back to Notes
      </button>

      <div className="mb-6">
        <div className="flex items-center gap-4">
          <Skeleton className="w-28 h-28 rounded-full animate-pulse bg-white/10" />

          <div className="flex flex-col gap-2">
            <Skeleton className="h-5 w-48 animate-pulse bg-white/10" />
            <Skeleton className="h-4 w-32 animate-pulse bg-white/10" />
            <Skeleton className="h-4 w-28 animate-pulse bg-white/10" />
            <Skeleton className="h-3 w-8 animate-pulse bg-white/10" />
          </div>
        </div>
      </div>

      <Skeleton className="h-8 w-64 mb-4 animate-pulse bg-white/10" />

      <div className="space-y-3 mb-8">
        <Skeleton className="h-4 w-full animate-pulse bg-white/10" />
        <Skeleton className="h-4 w-5/6 animate-pulse bg-white/10" />
        <Skeleton className="h-4 w-2/3 animate-pulse bg-white/10" />
      </div>

      <Skeleton className="h-3 w-48 animate-pulse bg-white/10" />
    </motion.div>
  );
}
