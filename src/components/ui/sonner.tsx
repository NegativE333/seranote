'use client';

import { useTheme } from 'next-themes';
import { Toaster as Sonner, ToasterProps } from 'sonner';

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = 'dark' } = useTheme();

  return (
    <Sonner
      theme="dark"
      className="toaster group"
      toastOptions={{
        style: {
          background: '#111113',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          color: '#ededed',
        },
        classNames: {
          toast: 'bg-[#111113] border border-white/10 text-gray-300',
          title: 'text-white/90',
          description: 'text-gray-400',
          success: 'bg-[#111113] border border-white/10',
          error: 'bg-[#111113] border border-white/10',
        },
      }}
      {...props}
    />
  );
};

export { Toaster };
