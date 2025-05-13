'use client'

import { House, MessageSquare, TriangleAlert } from "lucide-react";
import { Card } from "../common/card";
import Link from "next/link";
import { ClassValue } from "clsx";
import { usePathname } from "next/navigation";
import clsx from "clsx";

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
        Icon: TriangleAlert,
        route: ""
    },
]

interface NavProps {
    className?: ClassValue;
}


export function NavUser({ className }: NavProps) {
    const pathname = usePathname();

    return (
        <Card width="w-auto" height="h-full" className={className}>
            <div className="flex flex-col gap-5">
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
        </Card>
    );
}