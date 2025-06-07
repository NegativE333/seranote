"use client";

import { useEffect, useState } from "react";

export const HeroSection = () => {
  const images = ["/images/hero-2.png", "/images/hero-3.png"];

  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 7000);

    return () => clearInterval(interval);
  }, [images.length]);
  return (
    <div
      className="w-full h-[480px] bg-cover bg-center bg-no-repeat flex justify-end items-end rounded-lg transition-all duration-1000 ease-linear"
      style={{ backgroundImage: `url('${images[currentImageIndex]}')` }}
    >
      <div className="bg-gray-500/30 p-8 rounded-lg backdrop-blur-[1px] h-full w-full flex flex-col justify-end">
        <h1 className="text-white text-5xl font-bold mb-4 mt-auto">
          A song, a letter, a feeling...
        </h1>
        <p className="text-white text-xl">
          Seranote is a platform for creating and sharing songs, letters, and
          feelings.
        </p>
      </div>
    </div>
  );
};
