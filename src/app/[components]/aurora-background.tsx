import { useState, useEffect } from 'react';
import { motion, useMotionValue, useTransform } from 'framer-motion';

export const AuroraBackground = () => {
  const StarParticle = () => {
    const [initialX, setInitialX] = useState(0);
    const [initialY, setInitialY] = useState(0);
    const size = useMotionValue(0);
    const opacity = useTransform(size, [0, 1.5], [0, 1]);

    useEffect(() => {
      const random = (min: number, max: number) => Math.random() * (max - min) + min;
      if (typeof window !== 'undefined') {
        setInitialX(random(0, window.innerWidth));
        setInitialY(random(0, window.innerHeight));
      }
      size.set(random(0.5, 1.5));
    }, [size]);

    return (
      <motion.circle
        cx={initialX}
        cy={initialY}
        r={size}
        fill="white"
        style={{ opacity }}
        animate={{ opacity: [0, 0.8, 0] }}
        transition={{
          duration: Math.random() * 2 + 3,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />
    );
  };

  const [stardust, setStardust] = useState<React.ReactNode[]>([]);
  useEffect(() => {
    const createStardust = () => {
      const count = 20;
      const newStardust = Array.from({ length: count }).map((_, i) => <StarParticle key={i} />);
      setStardust(newStardust);
    };
    createStardust();
  }, []);

  return (
    <div className="fixed inset-0 w-full h-full -z-10 overflow-hidden">
      <motion.div
        className="absolute top-[-20%] left-[-10%] w-[40rem] h-[40rem] bg-purple-900/30 rounded-full filter blur-3xl"
        animate={{ x: ['-10%', '10%', '-10%'], y: ['-20%', '0%', '-20%'] }}
        transition={{ duration: 40, repeat: Infinity, repeatType: 'mirror', ease: 'easeInOut' }}
      />
      <motion.div
        className="absolute bottom-[-30%] right-[-15%] w-[50rem] h-[50rem] bg-pink-900/20 rounded-full filter blur-3xl"
        animate={{ x: ['-15%', '0%', '-15%'], y: ['-30%', '-10%', '-30%'] }}
        transition={{
          duration: 35,
          repeat: Infinity,
          repeatType: 'mirror',
          ease: 'easeInOut',
          delay: 5,
        }}
      />
      <svg className="absolute inset-0 w-full h-full opacity-70">
        <g>{stardust}</g>
      </svg>
    </div>
  );
};
