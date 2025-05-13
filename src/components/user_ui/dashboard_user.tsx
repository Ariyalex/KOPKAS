import { ClassValue } from "clsx";
import { Card } from "../common/card";
import clsx from "clsx";
import Image from "next/image";
import { FilledButton } from "../common/button";
import { Book, MessageSquare, TriangleAlert } from "lucide-react";

interface ReportsItemDummy {
    id: string;
    submitted: string;
    status: string;
}

//item dummy report
const ReportContentDummy: ReportsItemDummy[] = [
    {
        id: "2025-001",
        submitted: "Mei 20, 2025",
        status: "In Progress"
    },
    {
        id: "2025-002",
        submitted: "April 30, 2025",
        status: "Resolved"
    },
    {
        id: "2025-003",
        submitted: "Mei 24, 2025",
        status: "Resolved"
    },
    {
        id: "2025-004",
        submitted: "Mei 22, 2025",
        status: "In Progress"
    },
]

interface DbUser {
    className?: ClassValue;
}


interface DbMessage {
    className?: ClassValue;
}

export function DashboardUser({ className }: DbUser) {
    return (
        <div className={clsx("flex flex-col gap-6", className)}>
            {/* profile */}
            <Card width="w-full">
                <div className="flex felx-row gap-5 items-center w-full">
                    <Image
                        src={"/dummy.jpg"}
                        alt="profile"
                        width={100} height={100}
                        className="rounded-full"
                    />
                    <div className="flex flex-col h-full p-6 w-full">
                        <h1 className="text-2xl text-[#5C8D89]">Vestia Zeta</h1>
                        <p className="text-[#5C8D89]">Active Member since April 17</p>
                        <div className="inline-flex mt-5">
                            {/* button edit profile */}
                            <FilledButton href="">
                                Edit Profile
                            </FilledButton>
                        </div>
                    </div>
                </div>
            </Card>

            {/* menu */}
            <div className="flex flex-row gap-6 w-full h-auto">
                <Card padding="p-8" className="flex-1 flex gap-2.5 flex-col">
                    <TriangleAlert color="white" size={40} fill="#74B49B" />
                    <h3 className="text-lg font-medium text-[#5C8D89]">Laporkan Insiden</h3>
                    <p>Isi form baru untuk melaporkan pelecehan</p>
                </Card>
                <Card padding="p-8" className="flex-1 flex gap-2.5 flex-col">
                    <MessageSquare color="#74B49B" size={40} />
                    <h3 className="text-lg font-medium text-[#5C8D89]">Pesan</h3>
                    <p>3 pesan belum dibaca</p>
                </Card>
                <Card padding="p-8" className="flex-1 flex gap-2.5 flex-col">
                    <Book color="#74B49B" size={40} />
                    <h3 className="text-lg font-medium text-[#5C8D89]">Resources</h3>
                    <p>Akses bantuan</p>
                </Card>
            </div>

            {/* rencent report */}
            <Card width="w-full" padding="p-8" className="h-auto flex flex-col overflow-hidden">
                <h1 className="text-2xl font-medium text-[#5C8D89]">Laporan Sebelumnya</h1>
                <div className="flex flex-col gap-4 my-4 overflow-y-auto">
                    {ReportContentDummy.map(({ id, submitted, status }, index) => (
                        <div key={index} className="flex flex-row pb-4 justify-between border-b-[#E5E7EB] border-b-[1px]">
                            <div className="flex flex-col">
                                <h3 className="text-[#5C8D89] font-medium text-lg">Report #{id}</h3>
                                <p>Submitted on {submitted}</p>
                            </div>
                            {status === "Resolved" ? (
                                <div className="py-1 px-2 w-fit h-fit text-sm rounded-full text-[#065F46] bg-[#D1FAE5]">
                                    {status}
                                </div>
                            ) : (
                                <div className="py-1 px-2 w-fit h-fit text-sm rounded-full text-[#B45309] bg-[#FEF3C7]">
                                    {status}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </Card>
        </div>
    );
}

interface MessagesItemDummy {
    name: string;
    photo: string;
    message: string;
    sent: string;
}

//item dummy pesan
const MessagesContentDummy: MessagesItemDummy[] = [
    {
        name: "Admin Kopkas",
        photo: "/dummy.jpg",
        message: "Laporan kamu sedang diproses, silahkan tunggu",
        sent: "2 jam yang lalu"
    },
    {
        name: "Psikolog Artoria",
        photo: "/dummy2.jpg",
        message: "Halo Zeta, gimana kabarmu?",
        sent: "Kemarin"
    },
]

// message
export function DashboardMessage({ className }: DbMessage) {
    return (
        <div className={clsx("", className)}>

            <Card width="w-full" height="h-full">
                <h1 className="text-2xl font-medium text-[#5C8D89]">Pesan</h1>
                <div className="flex flex-col gap-4 my-4">
                    {MessagesContentDummy.map(({ name, photo, message, sent }, index) => (
                        <div key={index} className="flex flex-row w-full gap-3 bg-[#F4F9F4] rounded-lg p-4">
                            <Image
                                src={photo}
                                alt="message"
                                width={60} height={60}
                                className="rounded-full h-[60px] w-[60px]"
                            />
                            <div className="flex flex-col gap-2">
                                <h3 className="text-[#5C8D89] font-medium text-lg">{name}</h3>
                                <p>{message}</p>
                                <p className="text-[#6B7280]">{sent}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </Card>
        </div>
    )
}