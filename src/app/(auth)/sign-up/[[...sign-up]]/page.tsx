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
            logoImageUrl: '/images/seranotelogo-1.png',
          },
          variables: {
            borderRadius: '8px',
          },
        }}
      />
    </div>
  );
}
