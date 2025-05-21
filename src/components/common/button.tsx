import clsx from "clsx";
import Link from "next/link";
import { ButtonHTMLAttributes, ReactNode } from "react";
import { ButtonGesture } from "../animation/transition";


interface FilledButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    children: ReactNode;
    bgColor?: string;
    width?: string;
    color?: string;
    paddingx?: string;
    paddingy?: string;
}

export function FilledButton({ children, bgColor = "bg-[#74B49B]", color = "text-white", paddingx = "px-6", paddingy = "py-3", width = "w-auto", ...rest }: FilledButtonProps) {
    return (
        <ButtonGesture>
            <button
                {...rest}
                className={clsx("inline-block h-auto rounded-lg cursor-pointer", bgColor, color, paddingx, paddingy, width)}
            >
                {children}
            </button>
        </ButtonGesture>
    )
}