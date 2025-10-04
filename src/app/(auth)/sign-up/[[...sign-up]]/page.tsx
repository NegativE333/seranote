import { SignUp } from '@clerk/nextjs';

export default function Page() {
  return (
    <div>
      <SignUp
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
    </div>
  );
}
