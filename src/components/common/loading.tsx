'use client'

import { motion } from "framer-motion";
import { TransitionFadeIn } from "../animation/transition";
import { ClassValue } from "clsx";
import clsx from "clsx";

interface LoadingProps {
    text?: string;
    fullScreen?: boolean;
    className?: ClassValue;
}

export function Loading({ text = "Loading...", fullScreen = true, className }: LoadingProps) {
    const containerClasses = fullScreen
        ? "h-screen w-screen flex items-center justify-center"
        : clsx("w-full h-full flex items-center justify-center", className); const spinVariants = {
            animate: {
                rotate: [0, 360],
                transition: {
                    repeat: Infinity,
                    repeatType: "loop" as const,
                    ease: "linear",
                    duration: 1
                }
            }
        };

    return (
        <TransitionFadeIn>
            <div className={containerClasses}>
                {/* Opsi 1: Menggunakan Rsuite Loader */}
                {/* <Loader size="lg" content={text} vertical /> */}

                {/* Opsi 2: Loader kustom dengan Framer Motion (dikomentari) */}
                <div className="flex flex-col items-center gap-4">
                    <motion.div
                        variants={spinVariants}
                        animate="animate"
                        className="w-12 h-12 border-4 border-[#5C8D89] border-t-transparent rounded-full"
                    />
                    <p className="text-lg text-[#5C8D89]">{text}</p>
                </div>
            </div>
        </TransitionFadeIn>
    );
}

export function SpinnerLoader() {
    const spinVariants = {
        animate: {
            rotate: [0, 360],
            transition: {
                repeat: Infinity,
                repeatType: "loop" as const,
                ease: "linear",
                duration: 1
            }
        }
    };

    return (
        <motion.div
            variants={spinVariants}
            animate="animate"
            className="w-6 h-6 border-3 border-white border-t-transparent rounded-full"
        />
    );
}
