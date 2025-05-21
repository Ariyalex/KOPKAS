'use client'

import { motion } from "framer-motion";
import { TransitionFadeIn } from "../animation/transition";
import { Loader } from "rsuite";

interface LoadingProps {
    text?: string;
    fullScreen?: boolean;
}

export function Loading({ text = "Loading...", fullScreen = true }: LoadingProps) {
    const containerClasses = fullScreen
        ? "h-screen w-screen flex items-center justify-center"
        : "w-full h-full flex items-center justify-center min-h-[200px]";

    const spinTransition = {
        loop: Infinity,
        ease: "linear",
        duration: 1
    };

    return (
        <TransitionFadeIn>
            <div className={containerClasses}>
                {/* Opsi 1: Menggunakan Rsuite Loader */}
                <Loader size="lg" content={text} vertical />

                {/* Opsi 2: Loader kustom dengan Framer Motion (dikomentari) */}
                {/* <div className="flex flex-col items-center gap-4">
          <motion.div
            animate={{ rotate: 360 }}
            transition={spinTransition}
            className="w-12 h-12 border-4 border-[#5C8D89] border-t-transparent rounded-full"
          />
          <p className="text-lg text-[#5C8D89]">{text}</p>
        </div> */}
            </div>
        </TransitionFadeIn>
    );
}

export function SpinnerLoader() {
    const spinTransition = {
        loop: Infinity,
        ease: "linear",
        duration: 1
    };

    return (
        <motion.div
            animate={{ rotate: 360 }}
            transition={spinTransition}
            className="w-6 h-6 border-2 border-white border-t-transparent rounded-full"
        />
    );
}
