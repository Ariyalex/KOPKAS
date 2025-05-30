'use client'

import { useMessageStore } from "@/stores/messageStore";
import { useReportStore } from "@/stores/reportStore";
import { useUserStore } from "@/stores/userStore";
import type { UserData } from "@/types";
import clsx from "clsx";
import { Edit, ImageIcon, MessageSquare, TriangleAlert, X } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";
import { FilledButton } from "../common/button";
import { Card } from "../common/card";
import { Loading } from "../common/loading"; // Loading state
import { StatusTag } from "../common/tag";

export function DashboardUser() {
    const [ userData ] = useState<UserData | null>(null);
    const { fetchCurrentUser, isLoading: userLoading } = useUserStore();
    const { reports, fetchReports, isLoading: reportLoading } = useReportStore();
    const { messages, fetchMessages, isLoading: messageLoading } = useMessageStore();

    const [showPhotoEdit, setShowPhotoEdit] = useState(false);
    const [showNameEdit, setShowNameEdit] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [newName, setNewName] = useState<string>("");

    // Handle the data fetching when the component mounts
    useEffect(() => {
        fetchCurrentUser(); fetchReports(); fetchMessages();
    }, [fetchCurrentUser, fetchReports, fetchMessages]);

    // Handle edit actions
    const handleEditClick = () => setIsEditing(!isEditing);
    const handleEditName = () => {
        setShowNameEdit(true);
        setShowPhotoEdit(false);
    };
    const handleEditPhoto = () => {
        setShowPhotoEdit(true);
        setShowNameEdit(false);
    };

    // Handle save name logic
    const handleSaveName = () => {
        if (newName !== "") {
            setShowNameEdit(false);
        }
    };

    if (userLoading || reportLoading || messageLoading) {
        return <Loading text="Loading..." fullScreen={false} />;
    }

    return (
        <div className="flex flex-row w-full h-full gap-6">
            <div className={clsx("flex h-full flex-col gap-6 flex-4/6")}>
            {/* lah ui nya? */}
                {/* profile */}
                <Card width="w-full">
                    {/* ketika ada user data */}
                    {userData && (
                        <div className="flex flex-row gap-5 items-center justify-start w-full">
                            <div className="relative">
                                <Image
                                    src={userData.photo || '/default_photo.png'}
                                    alt="profile"
                                    width={100}
                                    height={100}
                                    className="rounded-full object-cover w-[100px] h-[100px]"
                                />
                                {/* ketika controller true */}
                                {showPhotoEdit && (
                                    <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center bg-black bg-opacity-50 rounded-full">
                                        <input
                                            type="file"
                                            accept="image/*"
                                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                        />
                                        <ImageIcon className="text-white" size={30} />
                                    </div>
                                )}
                            </div>
                            <div className="flex flex-col gap-2 h-full w-auto">
                                <div>
                                    {/* ketika controller true */}
                                    {showNameEdit ? (
                                        <div className="flex items-center gap-2 mb-2">
                                            <input
                                                type="text"
                                                value={newName}
                                                onChange={(e) => setNewName(e.target.value)}
                                                className="text-xl text-[#5C8D89] border-[#5C8D89] border-b-2 outline-none bg-transparent"
                                            />
                                            <FilledButton
                                                onClick={handleSaveName}
                                                paddingy="py-1"
                                                paddingx="px-3"
                                            >
                                                Save
                                            </FilledButton>
                                            <FilledButton
                                                onClick={() => setShowNameEdit(false)}
                                                bgColor="bg-gray-300"
                                                paddingy="py-1"
                                                paddingx="px-3"
                                            >
                                                <X size={16} />
                                            </FilledButton>
                                        </div>
                                    ) : (
                                        <h1 className="text-2xl text-[#5C8D89]">{userData.full_name}</h1>
                                    )}
                                    <p className="text-[#5C8D89]">
                                        Active Member since{' '}
                                        {new Date(userData.created_at).toLocaleDateString('en-US', {
                                            month: 'long',
                                            day: 'numeric',
                                            year: 'numeric'
                                        })}
                                    </p>
                                </div>
                                <div className="inline-flex gap-2">
                                    {isEditing ? (
                                        <>
                                            <FilledButton
                                                onClick={handleEditName}
                                                bgColor={showNameEdit ? "bg-[#5C8D89]" : "bg-[#74B49B]"}
                                            >
                                                <div className="flex items-center gap-2">
                                                    <Edit size={16} />
                                                    Edit Name
                                                </div>
                                            </FilledButton>
                                            <FilledButton
                                                onClick={handleEditPhoto}
                                                bgColor={showPhotoEdit ? "bg-[#5C8D89]" : "bg-[#74B49B]"}
                                            >
                                                <div className="flex items-center gap-2">
                                                    <ImageIcon size={16} />
                                                    Edit Photo
                                                </div>
                                            </FilledButton>
                                            <FilledButton
                                                onClick={handleEditClick}
                                                bgColor="bg-gray-400"
                                            >
                                                Cancel
                                            </FilledButton>
                                        </>
                                    ) : (
                                        <FilledButton onClick={handleEditClick}>
                                            <div className="flex items-center gap-2">
                                                <Edit size={16} />
                                                Edit Profile
                                            </div>
                                        </FilledButton>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}
                </Card>

                {/* menu */}
                <div className="flex flex-row gap-6 w-full h-auto">
                    <Card padding="p-5" className="flex-1 flex gap-2.5 flex-col">
                        <TriangleAlert color="white" size={40} fill="#74B49B" />
                        <h3 className="text-lg font-medium text-[#5C8D89]">Laporan!</h3>
                        <p><span>{reports.length}</span> Insiden telah kamu laporkan</p>
                    </Card>
                    <Card padding="p-5" className="flex-1 flex gap-2.5 flex-col">
                        <MessageSquare color="#74B49B" size={40} />
                        <h3 className="text-lg font-medium text-[#5C8D89]">Pesan</h3>
                        <p><span>{messages.length}</span> pesan belum dibaca</p>
                    </Card>
                </div>

                {/* rencent report */}
                <Card width="w-full" padding="p-5" height="h-full" className="flex flex-col overflow-hidden">
                    <h1 className="text-2xl font-medium text-[#5C8D89]">Laporan Sebelumnya</h1>
                    <div className="flex flex-col gap-4 pr-5 my-4 overflow-y-auto">
                        {reports.map((report) => (
                            <div key={report.id} className="flex flex-row pb-4 justify-between border-b-[#E5E7EB] border-b-[1px]">
                                <div className="flex flex-col">
                                    <h3 className="text-[#5C8D89] font-medium text-lg">Report <span>{report.id}</span></h3>
                                    <p>Submitted on {new Date(report.created_at).toLocaleDateString()}</p>
                                </div>
                                <StatusTag status={report.status} />
                            </div>
                        ))}
                    </div>
                </Card>
            </div>
            {/* <DashboardMessage  className="flex-2/6" /> */}
        </div>
    );
}

// chatnya ntaran mas

// message
// export function DashboardMessage({ className }: DbMessage) {
//     const supabase = createClientComponentClient<Database>()
//     const [messages, setMessages] = useState<Message[]>([])

//     // Fetch messages
//     return (
//         <div className={clsx("", className)}>
//             <Card width="w-full" height="h-full" className="flex flex-col overflow-hidden">
//                 <h1 className="text-2xl font-medium text-[#5C8D89]">Pesan</h1>
//                 <div className="flex flex-col gap-4 my-4 h-auto overflow-y-scroll">
//                     {messages.map((message, index) => (
//                         <div key={index} className="flex flex-row w-full gap-3 bg-[#F4F9F4] rounded-lg p-4">
//                             <div className="flex flex-col gap-2">
//                                 <h3 className="text-[#5C8D89] font-medium text-lg">
//                                     {message.sender.full_name}
//                                 </h3>
//                                 <p className="truncate max-w-[230px] overflow-hidden">
//                                     {message.message}
//                                 </p>
//                                 <p className="text-[#6B7280]">
//                                     {new Date(message.created_at).toLocaleDateString()}
//                                 </p>
//                             </div>
//                         </div>
//                     ))}
//                 </div>
//             </Card>
//         </div>
//     )
// }