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
}

export function Card({ children, width, height, padding = "p-5", shadow = "shadow-sm", bgColor = "bg-white", className }: CardProps) {
    return (
        <div className={clsx("rounded-lg w-fit overflow-clip", width, height, padding, shadow, bgColor, className)}>
            {children}
        </div>
    );
}