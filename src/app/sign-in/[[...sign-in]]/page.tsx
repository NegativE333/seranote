import { SignIn } from '@clerk/nextjs';
import Image from 'next/image';

export default function Page() {
  return (
    <div className="flex items-center justify-center mt-10">
      <div className="flex w-full max-w-3xl lg:shadow-2xl lg:rounded-lg overflow-hidden">
        <div className="hidden lg:block w-1/2 relative">
          <Image
            src="/images/male-writing-letter.png"
            alt="Authentication"
            fill
            className="object-cover"
            priority
          />
        </div>
        <div className="w-full lg:w-1/2 flex items-center justify-center pb-7 lg:pb-0">
          <SignIn
            appearance={{
              layout: {
                socialButtonsPlacement: 'bottom',
                logoPlacement: 'inside',
                logoImageUrl: '/images/seranotelogo-1.png',
              },
            }}
          />
        </div>
      </div>
    </div>
  );
}
