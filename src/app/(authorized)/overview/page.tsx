'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function OverviewPage() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to sent notes page
    router.replace('/notes');
  }, [router]);

  return null;
}
