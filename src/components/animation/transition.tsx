'use client'

import { motion } from "framer-motion";
import { usePathname } from "next/navigation";
import { ReactNode, useEffect } from "react";

interface PageTransitionProps {
    children: ReactNode;
    className?: string;
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