import { ClassValue } from "clsx";
import { Card } from "../common/card";
import clsx from "clsx";
import Image from "next/image";
import { RouteButton } from "../common/button";
import { Book, MessageSquare, TriangleAlert } from "lucide-react";
import { MessagesContentDummy, DummyUserContent } from "./dummy/chat_dummy";
import { ReportContentDummy } from "./dummy/reports_dummy";

interface DbUser {
    className?: ClassValue;
}


interface DbMessage {
    className?: ClassValue;
}

export function DashboardUser({ className }: DbUser) {
    // Mengambil data user dari DummyUserContent
    const userData = DummyUserContent.find(user => user.role === "user");
    const messageData = MessagesContentDummy;

    return (
        <div className={clsx("flex flex-col gap-6", className)}>
            {/* profile */}
            <Card width="w-full">
                <div className="flex felx-row gap-5 items-center w-full">
                    {userData && (
                        <>
                            <Image
                                src={userData.photo}
                                alt="profile"
                                width={100}
                                height={100}
                                className="rounded-full object-cover w-[100px] h-[100px]"
                            />
                            <div className="flex flex-col h-full w-full">
                                <h1 className="text-2xl text-[#5C8D89]">{userData.name}</h1>
                                <p className="text-[#5C8D89]">Active Member since April 17</p>
                                <div className="inline-flex mt-5">
                                    {/* button edit profile */}
                                    <RouteButton href="">
                                        Edit Profile
                                    </RouteButton>
                                </div>
                            </div>
                        </>
                    )}
                </div>
            </Card>

            {/* menu */}
            <div className="flex flex-row gap-6 w-full h-auto">
                <Card padding="p-5" className="flex-1 flex gap-2.5 flex-col">
                    <TriangleAlert color="white" size={40} fill="#74B49B" />
                    <h3 className="text-lg font-medium text-[#5C8D89]">Laporan!</h3>
                    <p>2 Insiden telah kamu laporkan</p>
                </Card>
                <Card padding="p-8" className="flex-1 flex gap-2.5 flex-col">
                    <MessageSquare color="#74B49B" size={40} />
                    <h3 className="text-lg font-medium text-[#5C8D89]">Pesan</h3>
                    <p><span>{messageData.length}</span> pesan belum dibaca</p>
                </Card>
                <Card padding="p-8" className="flex-1 flex gap-2.5 flex-col">
                    <Book color="#74B49B" size={40} />
                    <h3 className="text-lg font-medium text-[#5C8D89]">Resources</h3>
                    <p>Akses bantuan</p>
                </Card>
            </div>

            {/* rencent report */}
            <Card width="w-full" padding="p-5" className="h-auto flex flex-col overflow-hidden">
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

// message
export function DashboardMessage({ className }: DbMessage) {
    return (
        <div className={clsx("", className)}>
            <Card width="w-full" height="h-full" className="flex flex-col overflow-hidden">
                <h1 className="text-2xl font-medium text-[#5C8D89]">Pesan</h1>
                <div className="flex flex-col gap-4 my-4 h-auto overflow-y-scroll">
                    {MessagesContentDummy.map((message, index) => {
                        const user = DummyUserContent.find(user => user.id === message.userId);
                        if (!user) return null;

                        return (
                            <div key={index} className="flex flex-row w-full gap-3 bg-[#F4F9F4] rounded-lg p-4">
                                <Image
                                    src={user.photo}
                                    alt={user.name}
                                    width={60}
                                    height={60}
                                    className="rounded-full object-cover w-[60px] h-[60px] flex-shrink-0"
                                />
                                <div className="flex flex-col gap-2">
                                    <h3 className="text-[#5C8D89] font-medium text-lg">{user.name}</h3>
                                    <p className="truncate max-w-[230px] overflow-hidden">{message.message}</p>
                                    <p className="text-[#6B7280]">{message.sent}</p>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </Card>
        </div>
    )
}