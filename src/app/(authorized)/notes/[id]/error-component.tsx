'use client';

import { AlertTriangle } from 'lucide-react';

interface ErrorComponentProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
}

export function ErrorComponent({
  title = 'Something went wrong',
  message = 'Please try again later',
  onRetry,
}: ErrorComponentProps) {
  return (
    <div className="flex flex-col items-center justify-center text-center py-20 space-y-4">
      <div className="w-16 h-16 flex items-center justify-center rounded-full bg-red-500/10">
        <AlertTriangle className="w-8 h-8 text-red-400" />
      </div>
      <div className="flex flex-col space-y-2">
        <h2 className="text-xl font-semibold text-white">{title}</h2>
        <p className="text-sm text-gray-400 max-w-sm">{message}</p>
      </div>
    </div>
  );
}
