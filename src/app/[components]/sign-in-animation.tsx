"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { Quote } from 'lucide-react';

export const SignInContent = () => {
    const quote = "Music and words combined are the soul's most powerful expression.";
    const words = quote.split(" ");

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.05, delayChildren: 0.3 }
        }
    };

    const wordVariants = {
        hidden: { opacity: 0, y: 10 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.5 }
        }
    };

    const iconVariants = {
        hidden: { opacity: 0, scale: 0.5 },
        visible: {
            opacity: 1,
            scale: 1,
            transition: { duration: 1 }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.8 }
        }
    };

    return (
        <motion.div 
            className="hidden lg:flex flex-col items-center justify-center relative w-full h-full text-center"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
        >
            <motion.div 
                className="relative w-full max-w-xl p-8"
                variants={itemVariants}
            >
                <motion.div 
                    className="absolute top-0 left-0 text-white/10"
                    variants={iconVariants}
                >
                    <Quote size={80} strokeWidth={1} />
                </motion.div>

                <motion.h1 
                    className="text-4xl font-semibold text-white/90 leading-relaxed tracking-wide"
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                >
                    {words.map((word, index) => (
                        <motion.span
                            key={index}
                            className="inline-block mr-[0.5rem]"
                            variants={wordVariants}
                        >
                            {word}
                        </motion.span>
                    ))}
                </motion.h1>
            </motion.div>
        </motion.div>
    );
}