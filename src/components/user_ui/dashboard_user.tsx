'use client'

import { useMessageStore } from "@/stores/messageStore";
import { useReportStore } from "@/stores/reportStore";
import { useUserStore } from "@/stores/userStore";
import clsx from "clsx";
import { Edit, ImageIcon, MessageSquare, TriangleAlert, X } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";
import { FilledButton } from "../common/button";
import { Card } from "../common/card";
import { Loading } from "../common/loading"; // Loading state
import { StatusTag } from "../common/tag";
import { Dropdown } from "rsuite";

export function DashboardUser() {
    const { currentUser, fetchCurrentUser, isLoading: userLoading, updateUserName, updateUserPhoto } = useUserStore();
    const { reports, fetchReports, isLoading: reportLoading } = useReportStore();
    const { messages, fetchMessages, isLoading: messageLoading } = useMessageStore();

    const [showPhotoEdit, setShowPhotoEdit] = useState(false);
    const [showNameEdit, setShowNameEdit] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [newName, setNewName] = useState<string>("");
    const [selectedFile, setSelectedFile] = useState<File | null>(null);

    // Handle the data fetching when the component mounts
    useEffect(() => {
        fetchCurrentUser(); fetchReports(); fetchMessages();
    }, [fetchCurrentUser, fetchReports, fetchMessages]);

    // Handle edit actions
    const handleEditFalse = () => {
        setIsEditing(false);
        setShowNameEdit(false);
        setShowPhotoEdit(false);
    };
    const handleEditName = () => {
        if (currentUser) {
            setNewName(currentUser.full_name);
        }
        setShowNameEdit(true);
        setShowPhotoEdit(false);
        setIsEditing(true);

    };
    const handleEditPhoto = () => {
        setShowPhotoEdit(true);
        setShowNameEdit(false);
        setSelectedFile(null);
        setIsEditing(true);
    };

    //handle file change
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setSelectedFile(file);

            updateUserPhoto(file).then(() => {
                setShowPhotoEdit(false);
            }).catch((error) => {
                console.log("error update photo: ", error);
            });
            setIsEditing(false);
        }
    }

    // Handle save name logic
    const handleSaveName = () => {
        if (newName !== "") {
            setShowNameEdit(false);
            updateUserName(newName!);
        }
    };

    const renderIconButton = (props: any, ref: React.Ref<any>) => {
        return (
            <FilledButton
                {...props}
                ref={ref}
                width="w-fit"
                paddingx="px-3"
                paddingy="py-1"
            >
                <div className="flex flex-row items-center gap-3">
                    <Edit size={16} />
                    Edit Profile
                </div>
            </FilledButton>
        );
    };

    if (userLoading || reportLoading || messageLoading) {
        return (
            <div className="w-full h-full flex items-center justify-center">
                <Loading text="Loading..." fullScreen={false} />
            </div>
        )
    }

    return (
        <div className="flex flex-row w-full h-full gap-6">
            <div className={clsx("flex h-full flex-col gap-6 flex-4/6")}>
                {/* lah ui nya? */}
                {/* profile */}
                <Card width="w-full" className="overflow-visible">
                    {/* ketika ada user data */}
                    {currentUser && (
                        <div className="flex flex-row gap-5 items-center justify-start w-full">
                            <div className="relative">
                                <Image
                                    src={currentUser.photo || '/default_photo.png'}
                                    alt="profile"
                                    width={100}
                                    height={100}
                                    className="rounded-full object-cover sm:w-[100px] shrink-0 sm:h-[100px] w-[80px] h-[80px]"
                                />
                                {/* ketika controller true */}
                                {showPhotoEdit && (
                                    <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center bg-black bg-opacity-50 rounded-full">
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={handleFileChange}
                                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                        />
                                        <ImageIcon className="text-white" size={30} />
                                    </div>
                                )}
                            </div>
                            <div className="flex flex-col gap-2 h-full sm:w-auto w-fit">
                                <div>
                                    {/* ketika controller true */}
                                    {showNameEdit ? (
                                        <div className="flex items-center gap-2 mb-2">
                                            <input
                                                type="text"
                                                value={newName}
                                                onChange={(e) => setNewName(e.target.value)}
                                                className="text-xl text-[#5C8D89] border-[#5C8D89] sm:w-[200] w-[100px] border-b-2 outline-none bg-transparent"
                                            />
                                            <FilledButton
                                                onClick={handleSaveName}
                                                paddingy="py-1"
                                                paddingx="px-3"
                                            >
                                                Save
                                            </FilledButton>
                                        </div>
                                    ) : (
                                        <h1 className="text-2xl text-[#5C8D89]">{currentUser.full_name}</h1>
                                    )}
                                    <p className="text-[#5C8D89]">
                                        Active Member since
                                    </p>
                                    <p className="text-[#5C8D89]">
                                        {new Date(currentUser.created_at).toLocaleDateString('en-US', {
                                            month: 'long',
                                            day: 'numeric',
                                            year: 'numeric'
                                        })}
                                    </p>
                                </div>
                                <div className="inline-flex gap-2">
                                    {isEditing ? (<FilledButton
                                        width="w-fit"
                                        paddingx="px-3"
                                        paddingy="py-1"
                                        onClick={handleEditFalse}
                                        bgColor="bg-gray-400"
                                    >
                                        Cancel
                                    </FilledButton>) :
                                        (<Dropdown renderToggle={renderIconButton} noCaret placement="bottomEnd">
                                            <Dropdown.Item as={"button"} onClick={handleEditName} icon={<Edit color="#5C8D89" />} className={
                                                "flex felx-col p-2 gap-2 text-[#5C8D89] list"}>
                                                <h3 className={
                                                    "flex felx-col p-2 gap-2 text-[#5C8D89] rounded-md"}>Edit Name</h3></Dropdown.Item>
                                            <Dropdown.Item as={"button"} onClick={handleEditPhoto} icon={<ImageIcon color="#5C8D89" />} className={
                                                "flex felx-col p-2 gap-2 text-[#5C8D89] list"}>
                                                <h3 className={
                                                    "flex felx-col p-2 gap-2 text-[#5C8D89] rounded-md"}>Edit Photo</h3></Dropdown.Item>
                                        </Dropdown>)
                                    }

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