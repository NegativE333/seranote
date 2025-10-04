'use client';

import { SignIn } from '@clerk/nextjs';

export default function Page() {
  return (
    <SignIn
      fallbackRedirectUrl={'/overview'}
      appearance={{
        layout: {
          socialButtonsPlacement: 'bottom',
          logoPlacement: 'inside',
          logoImageUrl: '/images/seranote-logo.png',
        },
        variables: {
          borderRadius: '8px',
        },
      }}
    />
  );
}
