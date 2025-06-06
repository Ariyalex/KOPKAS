'use client'

import { HeaderUser } from "@/components/user_ui/header_user";
import { NavUser } from "@/components/user_ui/nav_user";
import { TransitionFadeIn } from "@/components/animation/transition";
import { usePathname } from "next/navigation";

export default function Layout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const isChatPage = pathname.includes("/user/chat");
    const hideNav = pathname.startsWith("/user/report/");
    const isReportDetailPage = pathname.includes("/report/") && pathname.split("/").length > 3;

    // Menentukan className berdasarkan halaman saat ini
    const contentClassName = isChatPage || isReportDetailPage
        ? "flex-5/6 flex" // Styling minimal untuk halaman chat
        : "flex w-full gap-5 flex-5/6"; // Class biasa untuk halaman lain

    return (
        <main>
            <HeaderUser />
            <div className="sm:p-8 p-5 flex flex-row gap-6 w-full h-screen">
                {!hideNav && <NavUser className="flex-1/6 md:flex hidden justify-between flex-col" />}
                <TransitionFadeIn className={contentClassName}>
                    {children}
                </TransitionFadeIn>
            </div>
        </main>
    );
}