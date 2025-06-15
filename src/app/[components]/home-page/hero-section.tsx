'use client';

import { Button } from '@/components/ui/button';
import { Heart } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';

export const HeroSection = () => {
  const [hearts, setHearts] = useState<
    {
      id: number;
      left: number;
      size: number;
      delay: number;
      path: 'zigzag' | 'wave' | 'straight';
    }[]
  >([]);

  useEffect(() => {
    const interval = setInterval(() => {
      setHearts((prev) => [
        ...prev,
        {
          id: Date.now(),
          left: Math.random() * 40 + 20, // Limited to avoid extreme right
          size: Math.random() * 0.5 + 0.5,
          delay: Math.random() * 2,
          path: ['zigzag', 'wave', 'straight'][Math.floor(Math.random() * 3)] as
            | 'zigzag'
            | 'wave'
            | 'straight',
        },
      ]);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col-reverse md:flex-row justify-between w-full md:h-[70vh] overflow-hidden rounded-lg">
      <div className="flex flex-col gap-4 justify-center items-center md:items-start h-full mt-4 md:mt-0 md:max-w-[50%]">
        <h1 className="text-4xl md:text-6xl font-bold primary-gradient leading-tight text-center md:text-left">
          A song, a letter, <br /> a feeling...
        </h1>
        <p className="text-lg md:text-xl font-medium secondary-gradient text-center md:text-left">
          Turn unsent thoughts into something beautiful — a note they’ll remember, and a song
          they’ll never forget.
        </p>
        <Link href={'/create'}>
          <Button variant={'primary'} className="mt-4">
            Create Seranote
          </Button>
        </Link>
      </div>
      <div className="h-full relative">
        <Image
          src={'/images/n-hero-2.png'}
          alt="hero-image"
          width={1000}
          height={1000}
          className="w-full h-full object-contain"
        />
        {hearts.map((heart) => (
          <div
            key={heart.id}
            className={`absolute bottom-2 md:bottom-[64px] animate-float-heart-${heart.path}`}
            style={{
              left: `${heart.left}%`,
              animationDelay: `${heart.delay}s`,
              transform: `scale(${heart.size})`,
            }}
          >
            <Heart className="w-6 h-6 text-pink-300 fill-pink-300 animate-pulse" />
          </div>
        ))}
      </div>
    </div>
  );
};
