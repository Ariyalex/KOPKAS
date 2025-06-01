'use client'

import { ChartLine, ClipboardList, LogOut, MessagesSquare } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import clsx from "clsx";
import { handleLogout } from "@/utils/auth";

interface NavItem {
    title: string;
    Icon: React.ElementType;
    route: string;
}

//nav item
export const navContentAdmin: NavItem[] = [
    {
        title: "Dashboard",
        Icon: ChartLine,
        //routing ditaruh di route
        route: "/admin"
    },
    {
        title: "Data Laporan",
        Icon: ClipboardList,
        route: "/admin/report"
    },
    {
        title: "Pesan",
        Icon: MessagesSquare,
        route: "/admin/chat"
    },
]

export function NavAdmin() {
    const pathname = usePathname();
    const router = useRouter(); const onLogout = async () => {
        await handleLogout();
        router.push("/");
        router.refresh(); // Force refresh to ensure all state is cleared
    }

    return (
        <div className="w-full h-[90vh] flex-1/6 md:flex hidden justify-between flex-col bg-white border-r-[#E5E7EB] border-r-2 p-5">
            <div className="flex flex-col gap-4">
                {navContentAdmin.map(({ title, Icon, route }, index) => {
                    const isActive = pathname === route;
                    return (
                        <Link
                            key={index}
                            href={route}
                            className={clsx(
                                "flex felx-col p-2 gap-2 text-[#5C8D89] rounded-md",
                                isActive
                                    ? "font-bold bg-[#A7D7C5]"
                                    : "bg-white font-normal hover:bg-[#F4F9F4]"
                            )}
                        >
                            <Icon color="#5C8D89" />
                            <h3 className="">{title}</h3>
                        </Link>
                    );
                })}

            </div>
            <button
                onClick={onLogout}
                className={clsx(
                    "flex felx-col p-2 gap-2 text-[#DC2626] rounded-md bg-white font-normal hover:bg-red-50 group cursor-pointer",
                )}
            >
                <LogOut className="text-[#DC2626]" />
                <h3 className="">Log Out</h3>
            </button>
        </div>
    );
}