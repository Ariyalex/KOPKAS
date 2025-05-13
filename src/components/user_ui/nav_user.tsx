import { House, MessageSquare, TriangleAlert } from "lucide-react";
import { Card } from "../common/card";
import Link from "next/link";
import { ClassValue } from "clsx";

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
        route: ""
    },
    {
        title: "Pesan",
        Icon: MessageSquare,
        route: ""
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
    return (
        <Card width="w-auto" height="h-full" className={className}>
            <div className="flex flex-col gap-5">
                {navContent.map(({ title, Icon, route }, index) => (
                    <Link key={index} href={route} className="flex felx-col p-2 gap-2 focus:text-black text-[#5C8D89] focus:font-bold focus:bg-[#A7D7C5] bg-white rounded-md">
                        <Icon color="#5C8D89" />
                        <h3 className="font-normal ">{title}</h3>
                    </Link>
                ))}
            </div>
        </Card>
    );
}