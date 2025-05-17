import clsx from "clsx";
import Link from "next/link";
import { ButtonHTMLAttributes, ReactNode } from "react";

interface ButtonProps {
    children: ReactNode;
    href: string;
}

interface FilledButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    children: ReactNode;
    bgColor?: string;
    color?: string;
    paddingx?: string;
    paddingy?: string;
}

export function RouteButton({ children, href }: ButtonProps) {
    return (
        <Link
            href={href}
            className="inline-block px-6 py-3 w-auto h-auto text-white rounded-lg bg-[#74B49B]"
        >
            {children}
        </Link>
    )
}

export function FilledButton({ children, bgColor = "bg-[#74B49B]", color = "text-white", paddingx = "px-6", paddingy = "py-3", ...rest }: FilledButtonProps) {
    return (
        <button
            {...rest}
            className={clsx("inline-block  w-auto h-auto rounded-lg cursor-pointer", bgColor, color, paddingx, paddingy)}
        >
            {children}
        </button>
    )
}