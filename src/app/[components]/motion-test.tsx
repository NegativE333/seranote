"use client"

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

// --- Type Definitions for TypeScript ---
interface Particle {
    id: number;
    Icon: React.FC<{ color: string }>;
    x: number;
    size: number;
    color: string;
    initialY: number;
    duration: number;
    delay: number;
    swayDuration: number;
    swayAmplitude: number;
}

interface IconProps {
    color: string;
}

// --- Configuration ---
const particleCount = 25;
const colors = ["#9911ff", "#ff0088", "#dd00ee"];

// --- SVG Icon Components (Typed) ---
const HeartIcon: React.FC<IconProps> = ({ color }) => (
    <svg width="100%" height="100%" viewBox="0 0 24 24" fill={color} xmlns="http://www.w3.org/2000/svg">
        <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
    </svg>
);

const MusicNoteIcon: React.FC<IconProps> = ({ color }) => (
    <svg width="100%" height="100%" viewBox="0 0 24 24" fill={color} xmlns="http://www.w3.org/2000/svg">
        <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z"/>
    </svg>
);

// --- Helper function (Typed) ---
const random = (min: number, max: number): number => Math.random() * (max - min) + min;

// --- Main Background Component ---
export default function SeranoteBackground() {
    const [particles, setParticles] = useState<Particle[]>([]);

    useEffect(() => {
        const newParticles: Particle[] = Array.from({ length: particleCount }).map((_, i) => {
            const isHeart = Math.random() > 0.5;
            return {
                id: i,
                Icon: isHeart ? HeartIcon : MusicNoteIcon,
                x: random(0, 100),
                size: random(15, 40),
                color: colors[Math.floor(random(0, colors.length))],
                initialY: random(100, 120),
                duration: random(20, 35),
                delay: random(0, 20),
                swayDuration: random(6, 12),
                swayAmplitude: random(20, 50),
            };
        });
        setParticles(newParticles);
    }, []);

    return (
        <div className="fixed inset-0 w-screen h-screen overflow-hidden -z-10">
            {/* This empty div creates the blurred background effect */}
            <div className="absolute inset-0 w-full h-full backdrop-blur-[3px] z-10"></div>
            {particles.map(p => (
                <motion.div
                    key={p.id}
                    className="absolute will-change-transform opacity-25 z-0"
                    style={{ // Dynamic styles remain as inline styles
                        left: `${p.x}vw`,
                        width: p.size,
                        height: p.size,
                    }}
                    initial={{ y: `${p.initialY}vh`, x: 0 }}
                    animate={{
                        y: '-20vh',
                        x: [0, p.swayAmplitude, -p.swayAmplitude, 0],
                    }}
                    transition={{
                        y: {
                            duration: p.duration,
                            repeat: Infinity,
                            repeatType: 'loop',
                            ease: 'linear',
                            delay: p.delay,
                        },
                        x: {
                            duration: p.swayDuration,
                            repeat: Infinity,
                            repeatType: 'mirror',
                            ease: 'easeInOut',
                            delay: p.delay,
                        }
                    }}
                >
                    <p.Icon color={p.color} />
                </motion.div>
            ))}
        </div>
    );
}