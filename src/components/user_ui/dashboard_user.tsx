'use client'

import clsx, { ClassValue } from "clsx";
import { Edit, ImageIcon, MessageSquare, TriangleAlert, X } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { FilledButton } from "../common/button";
import { Card } from "../common/card";
import { Tag } from "../common/tag";
import { DummyUserContent, MessagesContentDummy } from "./dummy/chat_dummy";
import { ReportContentDummy } from "./dummy/reports_dummy";

interface DbUser {
    className?: ClassValue;
}

interface DbMessage {
    className?: ClassValue;
}

export function DashboardUser({ className }: DbUser) {
    // Mengambil data 
    const userData = DummyUserContent.find(user => user.role === "user");
    const messageData = MessagesContentDummy;
    const reports = ReportContentDummy;

    //controller
    const [isEditing, setIsEditing] = useState(false); //editing
    const [newName, setNewName] = useState(userData?.name || ""); //controller input nama baru
    const [showNameEdit, setShowNameEdit] = useState(false); //menampilkan tombol edit nama
    const [showPhotoEdit, setShowPhotoEdit] = useState(false);// menampilkan tombol edit foto


    //handle edit click
    const handleEditClick = () => {
        setIsEditing(!isEditing);
        // Reset states ketika menekan tombol edit
        if (isEditing) {
            setShowNameEdit(false);
            setShowPhotoEdit(false);
        }
    };

    //menangani edit name
    const handleEditName = () => {
        setShowNameEdit(true); //edit name ditampilkan
        setShowPhotoEdit(false);//edit photo tidak ditampilkan
    };

    //menangani edit photo
    const handleEditPhoto = () => {
        setShowPhotoEdit(true);//menampilkan edit photo
        setShowNameEdit(false);//tidak menampilkan edit nama
    };

    const handleSaveName = () => {
        // disini untuk menyimpan nama ke database
        //sementara edit form ditutup
        setShowNameEdit(false);
    };

    const handleSavePhoto = () => {
        // disini untuk menyimpan photo ke database
        // sementara edit ditutup
        setShowPhotoEdit(false);
    };

    return (
        <div className={clsx("flex flex-col gap-6", className)}>
            {/* profile */}
            <Card width="w-full">
                {/* ketika ada user data */}
                {userData && (
                    <div className="flex felx-row gap-5 items-center justify-start w-full">
                        <div className="relative">
                            <Image
                                src={userData.photo}
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
                                    <h1 className="text-2xl text-[#5C8D89]">{userData.name}</h1>
                                )}
                                <p className="text-[#5C8D89]">Active Member since April 17</p>
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
                    <p><span>{messageData.length}</span> pesan belum dibaca</p>
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
                                <Tag color="text-[#065F46]" bgColor="bg-[#D1FAE5]">
                                    {status}
                                </Tag>
                            ) : (
                                <Tag color="text-[#B45309]" bgColor="bg-[#FEF3C7]">
                                    {status}
                                </Tag>
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