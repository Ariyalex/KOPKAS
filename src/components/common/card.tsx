import { ReactNode } from "react";
import clsx, { ClassValue } from "clsx";

interface CardProps {
    children: ReactNode;
    width?: string;
    height?: string;
    padding?: string;
    shadow?: string;
    bgColor?: string;
    className?: ClassValue;
    overflow?: string;
}

export function Card({ children, width = "w-fit", height, padding = "p-5", shadow = "shadow-sm", bgColor = "bg-white", overflow = "overflow-clip", className }: CardProps) {
    return (
        <div className={clsx("rounded-lg ", width, height, padding, shadow, bgColor, overflow, className)}>
            {children}
        </div>
    );
}