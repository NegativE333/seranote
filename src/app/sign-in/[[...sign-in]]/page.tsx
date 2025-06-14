import { notes } from '@/app/[helper]/util';
import { SignIn } from '@clerk/nextjs';
import { Music, Music2 } from 'lucide-react';
import Image from 'next/image';

export default function Page() {
  return (
    <div className="md:mt-10 max-w-[800px] mx-auto">
      <div className="hidden md:flex items-center justify-center">
        <div className="relative flex items-center justify-center w-[50%]">
          <Image
            src={'/images/signin-2.png'}
            height={900}
            width={900}
            alt="signin-img"
            className="object-contain max-w-[480px] h-[70vh]"
          />
          {notes.map((note) => (
            <div
              key={note.id}
              className={`absolute bottom-0 animate-float-note`}
              style={{
                left: `${note.left}%`,
                animationDelay: `${note.delay}s`,
                transform: `scale(${note.size})`,
              }}
            >
              <Music className="w-6 h-6 text-pink-300" />
            </div>
          ))}
        </div>
        <div className="flex items-center justify-center w-[50%]">
          <SignIn
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
      </div>
      <div className="md:hidden">
        <div className="absolute top-[-24px] left-8">
          <div className="relative w-[100%]">
            <Image
              src={'/images/signin-2.png'}
              height={100}
              width={900}
              alt="signin-img"
              className="object-contain h-[80vh] w-[100vw]"
            />
            {notes.map((note) => (
              <div
                key={note.id}
                className={`absolute bottom-0 animate-float-note`}
                style={{
                  left: `${note.left}%`,
                  animationDelay: `${note.delay}s`,
                  transform: `scale(${note.size})`,
                }}
              >
                <Music className="w-6 h-6 text-pink-300" />
              </div>
            ))}
          </div>
        </div>
        <div className="flex items-end h-[64vh] justify-center">
          <SignIn
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
      </div>
    </div>
  );
}
