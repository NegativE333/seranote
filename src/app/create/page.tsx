'use client';

import { Input, LabeledInput } from '@/components/ui/input';
import Image from 'next/image';
import CreateForm from '../[components]/create-page/create-form';

export default function Create() {
  return (
    <div className="flex flex-col md:flex-row h-screen">
      <div className="w-full md:w-[40%] h-fit md:sticky md:top-[64px] self-start">
        <Image
          src={'/images/create-1.png'}
          alt="hero-image"
          width={400}
          height={400}
          className="w-full h-[30vh] md:h-[60vh] object-contain"
        />
      </div>
      <div className="flex flex-col items-center md:items-start md:w-[60%] p-8 overflow-y-auto">
        <h1 className="text-2xl font-bold primary-gradient">Create a Seranote</h1>
        <p className="text-md font-medium secondary-gradient text-center md:text-left">
          Start with a feeling, wrap it in melody, and share it with someone special.
        </p>
        <CreateForm />
      </div>
    </div>
  );
}
