'use client'

import { HeaderUser } from "@/components/user_ui/header_user";
import { NavUser } from "@/components/user_ui/nav_user";
import { TransitionFadeIn } from "@/components/animation/transition";
import { usePathname } from "next/navigation";

export default function Layout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const isChatPage = pathname.includes("/user/chat");

    // Menentukan className berdasarkan halaman saat ini
    const contentClassName = isChatPage
        ? "flex-5/6 flex" // Styling minimal untuk halaman chat
        : "flex w-full gap-5 flex-5/6"; // Class biasa untuk halaman lain

    return (
        <main>
            <HeaderUser />
            <div className="p-8 flex flex-row gap-6 w-full h-screen">
                <NavUser className="flex-1/6 flex justify-between flex-col" />
                <TransitionFadeIn className={contentClassName}>
                    {children}
                </TransitionFadeIn>
            </div>
        </main>
    );
}