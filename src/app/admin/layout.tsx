'use client'

import { HeaderAdmin } from "@/components/admin_ui/header_admin";
import { NavAdmin } from "@/components/admin_ui/nav_admin";
import { usePathname } from "next/navigation";

export default function Layout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();

    const hideNav = pathname.startsWith("/admin/report/");
    return (
        <main>
            <HeaderAdmin />
            <div className="flex flex-row w-full h-auto">
                {!hideNav && <NavAdmin />}
                {children}
            </div>
        </main>
    );
}