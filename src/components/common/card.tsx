import { ReactNode } from "react";
import clsx, { ClassValue } from "clsx";

interface CardProps {
    children: ReactNode;
    width?: string;
    height?: string;
    padding?: string;
    shadow?: string;
    className?: ClassValue;
}

export function Card({ children, width, height, padding = "p-5", shadow = "shadow-sm", className }: CardProps) {
    return (
        <div className={clsx("rounded-lg bg-white w-fit overflow-clip", width, height, padding, shadow, className)}>
            {children}
        </div>
    );
}