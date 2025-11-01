import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { ClerkProvider } from '@clerk/nextjs';
import { Providers } from '@/lib/query-provider';
import { PusherProvider } from '@/lib/pusher-provider';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Seranote',
  description: 'Need to change this',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider
      appearance={{
        variables: {
          colorText: '#1C0D12',
          borderRadius: '0',
        },
      }}
    >
      <html lang="en" suppressHydrationWarning className="dark">
        <body className={`${inter.className} antialiased`}>
          <Providers>
            <PusherProvider>{children}</PusherProvider>
          </Providers>
        </body>
      </html>
    </ClerkProvider>
  );
}
