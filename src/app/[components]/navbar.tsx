import { SignedIn, UserButton } from '@clerk/nextjs';
import Image from 'next/image';

export const Navbar = () => {
  return (
    <div className="flex justify-between items-center p-4 h-[64px] border-b border-[#E5E8EB]">
      <div className="flex items-center gap-2 relative">
        <Image
          src="/images/seranotelogo-1.png"
          alt="Seranote Logo"
          width={40}
          height={40}
          className="w-10 h-10 object-contain"
        />
        <h1 className="text-primary text-2xl font-bold">Seranote</h1>
      </div>
      <div className="flex items-center gap-2">
        <SignedIn>
          <UserButton
            appearance={{
              variables: {
                borderRadius: '4px',
              },
            }}
            signInUrl="/sign-in"
          />
        </SignedIn>
      </div>
    </div>
  );
};
