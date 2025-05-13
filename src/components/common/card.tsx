import { ReactNode } from "react";
import clsx, { ClassValue } from "clsx";

interface CardProps {
    children: ReactNode;
    width?: string;
    height?: string;
    padding?: string;
    className?: ClassValue;
}

export function Card({ children, width, height, padding = "p-5", className }: CardProps) {
    return (
        <div className={clsx("rounded-lg bg-white shadow-sm w-fit", width, height, padding, className)}>
            {children}
        </div>
    );
}