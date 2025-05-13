import Link from "next/link";
import { ReactNode } from "react";

interface ButtonProps {
    children: ReactNode;
    href: string;
}

export function FilledButton({ children, href }: ButtonProps) {
    return (
        <Link
            href={href}
            className="inline-block px-6 py-3 w-auto h-auto text-white rounded-lg bg-[#74B49B]"
        >
            {children}
        </Link>
    )
}