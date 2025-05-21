'use client'

import { AnimatePresence } from "framer-motion";
import { ReactNode } from "react";
import { usePathname } from "next/navigation";

interface AnimationProviderProps {
    children: ReactNode;
}

export function AnimationProvider({ children }: AnimationProviderProps) {
    const pathname = usePathname();

    return (
        <AnimatePresence mode="wait">
            {children}
        </AnimatePresence>
    )
}