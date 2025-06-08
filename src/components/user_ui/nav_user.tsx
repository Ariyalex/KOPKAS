'use client'

import { ClipboardList, House, LogOut, MessageSquare, Plus } from "lucide-react";
import { Card } from "../common/card";
import Link from "next/link";
import { ClassValue } from "clsx";
import { usePathname, useRouter } from "next/navigation";
import clsx from "clsx";
import { UserData } from "@/stores/userStore";
import { handleLogout } from "@/utils/auth";
import { Modal } from "rsuite";
import React from "react";
import { FilledButton } from "../common/button";

interface NavItem {
    title: string;
    Icon: React.ElementType;
    route: string;
}

//nav item
export const navContent: NavItem[] = [
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




export function NavUser({ className }: NavProps) {

    //state dialog
    const [openD, setOpenD] = React.useState(false);
    const handleOpenD = () => setOpenD(true);
    const handleCloseD = () => setOpenD(false);


    const pathname = usePathname();
    const router = useRouter();
    const onLogout = async () => {
        await handleLogout();
        router.push("/");
        router.refresh(); // Force refresh to ensure all state is cleared
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
                            <h3 >{title}</h3>
                        </Link>
                    );
                })}

            </div>
            <button
                onClick={handleOpenD}
                className={clsx(
                    "flex felx-col p-2 gap-2 text-[#DC2626] rounded-md bg-white font-normal hover:bg-red-50 group cursor-pointer",
                )}
            >
                <LogOut className="text-[#DC2626]" />
                <h3 className="">Log Out</h3>
            </button>
            <Modal open={openD} onClose={handleCloseD} backdrop="static" role="alertdialog">
                <Modal.Header>
                    <Modal.Title>
                        Yakin LogOut?
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    Kamu yakin logout dari Kopkas?
                </Modal.Body>
                <Modal.Footer className="flex flex-row justify-end gap-5">
                    <FilledButton onClick={onLogout} bgColor="bg-red-100" color="text-[#DC2626]" paddingy="py-2" paddingx="px-3">
                        Log Out
                    </FilledButton>
                    <FilledButton onClick={handleCloseD} bgColor="bg-gray-50" color="text-black" paddingy="py-2" paddingx="px-3">
                        Cancel
                    </FilledButton>
                </Modal.Footer>
            </Modal>
        </Card>
    );
} 