'use client'

import { ClassValue } from "clsx";
import { motion } from "framer-motion";
import { usePathname } from "next/navigation";
import { ReactNode, useEffect } from "react";

interface PageTransitionProps {
    children: ReactNode;
    className?: string;
}

interface ButtonGesturesProps {
    children: ReactNode;
    clasName?: string;
}

interface CardGesturesProps {
    children: ReactNode;
    clasName?: string;
}

export function TransitionFadeIn({ children, className }: PageTransitionProps) {
    const pathname = usePathname();

    // Variasi untuk animasi
    const variants = {
        hidden: { opacity: 0, y: 10 },
        enter: { opacity: 1, y: 0 },
        exit: { opacity: 0, y: -10 },
    };

    // Untuk debugging: log ketika komponen dirender
    useEffect(() => {
        console.log("TransitionFadeIn rendered with path:", pathname);
    }, [pathname]);

    return (
        <motion.div
            key={pathname}
            variants={variants}
            initial="hidden"
            animate="enter"
            exit="exit"
            transition={{ duration: 0.4, ease: "easeInOut" }}
            className={className || ""}
        >
            {children}
        </motion.div>
    );
}

export function ButtonGesture({ children, clasName }: ButtonGesturesProps) {
    return (
        <motion.div
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
            transition={{ duration: 0.1 }}
            className={clasName}
        >
            {children}
        </motion.div>
    )
}

export function CardGesture({ children, clasName }: CardGesturesProps) {
    return (
        <motion.div
            whileHover={{ scale: 1.04 }}
            transition={{ duration: 0.1 }}
            className={clasName}
        >
            {children}
        </motion.div>
    )
}