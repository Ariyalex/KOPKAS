'use client'

import { ClipboardList, House, LogOut, MessageSquare, Plus } from "lucide-react";
import { Card } from "../common/card";
import Link from "next/link";
import { ClassValue } from "clsx";
import { usePathname, useRouter } from "next/navigation";
import clsx from "clsx";
import { supabase } from "@/lib/supabase";

interface NavItem {
    title: string;
    Icon: React.ElementType;
    route: string;
}

//nav item
const navContent: NavItem[] = [
    {
        title: "Dashboard",
        Icon: House,
        //routing ditaruh di route
        route: "/user"
    },
    {
        title: "Pesan",
        Icon: MessageSquare,
        route: "/user/chat"
    },
    {
        title: "Laporkan Insiden",
        Icon: Plus,
        route: "/user/form"
    },
    {
        title: "Daftar Laporan",
        Icon: ClipboardList,
        route: "/user/report"
    },


]

interface NavProps {
    className?: ClassValue;
}

export const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
        console.log(error.message)
    }
}


export function NavUser({ className }: NavProps) {
    const pathname = usePathname();
    const router = useRouter()

    const onLogout = async () => {
        await handleLogout();
        router.push("/");
    }

    return (
        <Card width="w-auto" height="h-full" className={className}>
            <div className="flex flex-col gap-4">
                {navContent.map(({ title, Icon, route }, index) => {
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
        </Card>
    );
} 