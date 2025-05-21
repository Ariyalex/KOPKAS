'use client'

import { HeaderAdmin } from "@/components/admin_ui/header_admin";
import { NavAdmin } from "@/components/admin_ui/nav_admin";
import { TransitionFadeIn } from "@/components/animation/transition";
import { usePathname } from "next/navigation";

export default function Layout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const isChatPage = pathname.includes("/admin/chat");
    const hideNav = pathname.startsWith("/admin/report/");
    const isReportDetailPage = pathname.includes("/report/") && pathname.split("/").length > 3; // Cek apakah berada di /report/[id]

    // Menentukan className berdasarkan halaman saat ini
    const contentClassName = isReportDetailPage || isChatPage
        ? "flex-5/6 flex" // Tidak ada className pada halaman detail report atau halaman chat
        : "flex flex-col h-full gap-5 flex-5/6 px-8 py-5 bg-[#F5FFFA]"; // Class biasa untuk halaman lain

    return (
        <main>
            <HeaderAdmin />
            <div className="flex flex-row w-full h-auto">
                {!hideNav && <NavAdmin />}
                <TransitionFadeIn className={contentClassName}>
                    {children}
                </TransitionFadeIn>
            </div>
        </main>
    );
}