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
    <div className="flex flex-col-reverse md:flex-row justify-between w-full h-[70vh] overflow-hidden rounded-lg">
      <div className="flex flex-col gap-4 justify-center h-full">
        <h1 className="text-6xl font-bold bg-gradient-to-r from-pink-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent leading-tight">
          A song, a letter, <br /> a feeling...
        </h1>
        <p className="text-xl font-medium bg-gradient-to-br from-pink-500 to-purple-600 bg-clip-text text-transparent">
          Seranote is a platform for creating and sharing songs, letters, and feelings.
        </p>
        <Button
          variant={'primary'}
          className="w-fit bg-gradient-to-r from-rose-400 to-pink-500 hover:from-rose-500 hover:to-pink-600 text-white border-0 mt-4"
        >
          <Link href={'/create'}>Create Seranote</Link>
        </Button>
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
            className={`absolute bottom-12 animate-float-heart-${heart.path}`}
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
