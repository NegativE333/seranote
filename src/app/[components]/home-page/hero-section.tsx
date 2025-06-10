'use client';

import { Heart } from 'lucide-react';
import { useEffect, useState } from 'react';

export const HeroSection = () => {
  const images = ['/images/hero-2.png', '/images/hero-3.png', '/images/hero-4.png'];

  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 7000);

    return () => clearInterval(interval);
  }, [images.length]);
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
          left: Math.random() * 90,
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
    <div className="relative w-full h-[480px]">
      <div
        className="w-full h-full bg-cover bg-center bg-no-repeat flex justify-end items-end rounded-lg transition-all duration-1000 ease-linear"
        style={{ backgroundImage: `url('${images[currentImageIndex]}')` }}
      >
        <div className="bg-gray-800/40 p-8 rounded-lg h-full w-full flex flex-col justify-end text-center md:text-left">
          <h1 className="text-white text-3xl md:text-5xl font-bold mb-4 mt-auto">
            A song, a letter, a feeling...
          </h1>
          <p className="text-white text-lg md:text-xl">
            Seranote is a platform for creating and sharing songs, letters, and feelings.
          </p>
        </div>
      </div>

      {hearts.map((heart) => (
        <div
          key={heart.id}
          className={`absolute bottom-0 animate-float-heart-${heart.path}`}
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
  );
};
