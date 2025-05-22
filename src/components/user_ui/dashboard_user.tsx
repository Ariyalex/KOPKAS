'use client'

import clsx, { ClassValue } from "clsx";
import { Edit, ImageIcon, MessageSquare, TriangleAlert, X } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";
import { FilledButton } from "../common/button";
import { Card } from "../common/card";
import { Tag } from "../common/tag";

// import keperluan backend
import type { Database } from "@/lib/database.types";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { Loading } from "../common/loading";

interface DbUser {
    className?: ClassValue;
}

interface DbMessage {
    className?: ClassValue;
}

interface UserData {
    id: string;
    email: string;
    full_name: string;
    role: string;
    created_at: string;
    photo?: string; // Menambahkan field photo yang digunakan di komponen
}

interface Report {
    id: string;
    title: string;
    status: string;
    created_at: string;
}

interface Message {
    id: string;
    message: string;
    created_at: string;
    sender: {
        id: string;
        full_name: string | null;
    }
}

export function DashboardUser({ className }: DbUser) {
    // Supabase client
    const supabase = createClientComponentClient<Database>();

    // Mengambil data 
    const [userData, setUserData] = useState<UserData | null>(null)
    const [reports, setReports] = useState<Report[]>([])
    const [messages, setMessages] = useState<Message[]>([])

    //controller
    const [isLoading, setIsLoading] = useState(true)
    const [isEditing, setIsEditing] = useState(false); //editing
    const [newName, setNewName] = useState("") //controller input nama baru
    const [showNameEdit, setShowNameEdit] = useState(false); //menampilkan tombol edit nama
    const [showPhotoEdit, setShowPhotoEdit] = useState(false);// menampilkan tombol edit foto

    // Fetch user data
    useEffect(() => {
        async function fetchUserData() {
            const { data: { session } } = await supabase.auth.getSession()
            if (!session) return

            const { data: userData, error } = await supabase
                .from('users')
                .select('*')
                .eq('id', session.user.id)
                .single()

            if (error) {
                console.error('Error fetching user:', error)
                return
            }

            setUserData(userData)
            setNewName(userData.full_name || '')
        }

        fetchUserData()
    }, [supabase])

    // Fetch reports
    useEffect(() => {
        async function fetchReports() {
            const { data: { session } } = await supabase.auth.getSession()
            if (!session) return

            const { data: reportsData, error } = await supabase
                .from('reports')
                .select('id, title, status, created_at')
                .eq('reporter_id', session.user.id)
                .order('created_at', { ascending: false })

            if (error) {
                console.error('Error fetching reports:', error)
                return
            }

            setReports(reportsData)
        }

        fetchReports()
    }, [supabase])

    // Fetch messages (chats)
    useEffect(() => {
        async function fetchMessages() {
            const { data: { session } } = await supabase.auth.getSession()
            if (!session) return

            const { data: messagesData, error } = await supabase
                .from('chats')
                .select(`
                    id,
                    message,
                    created_at,
                    sender:sender_id (
                        id,
                        full_name
                    )
                `)
                .eq('sender_id', session.user.id)
                .order('created_at', { ascending: false })

            if (error) {
                console.error('Error fetching messages:', error)
                return
            }

            if (messagesData) {
                setMessages(messagesData as unknown as Message[])
            } else {
                setMessages([])
            }

        }

        fetchMessages()
    }, [supabase])

    // Handle name update
    const handleSaveName = async () => {
        const { data: { session } } = await supabase.auth.getSession()
        if (!session) return

        const { error } = await supabase
            .from('users')
            .update({ full_name: newName })
            .eq('id', session.user.id)

        if (error) {
            console.error('Error updating name:', error)
            return
        }

        setShowNameEdit(false)
        if (userData) {
            setUserData({ ...userData, full_name: newName })
        }
    }

    const handleSavePhoto = async (event: React.ChangeEvent<HTMLInputElement>) => {
        try {
            setIsLoading(true);
            const file = event.target.files?.[0]
            if (!file) {
                throw new Error('No file selected')
            }

            // Validasi file size (max 2MB)
            if (file.size > 2 * 1024 * 1024) {
                throw new Error('File size too large (max 2MB)')
            }

            // Validasi file type
            if (!file.type.startsWith('image/')) {
                throw new Error('File must be an image')
            }

            const { data: { session } } = await supabase.auth.getSession()
            if (!session) {
                throw new Error('No session found')
            }

            // Delete old photo if exists
            if (userData?.photo) {
                const oldPath = userData.photo.split('/').pop()
                if (oldPath) {
                    await supabase.storage
                        .from('avatars')
                        .remove([`${session.user.id}/${oldPath}`])
                }
            }

            // Upload new photo
            const fileExt = file.name.split('.').pop()
            const fileName = `${Date.now()}.${fileExt}`
            const filePath = `${session.user.id}/${fileName}`

            const { error: uploadError } = await supabase.storage
                .from('avatars')
                .upload(filePath, file, {
                    cacheControl: '3600',
                    upsert: true
                })

            if (uploadError) {
                throw new Error(`Upload error: ${uploadError.message}`)
            }

            // Get public URL
            const { data: { publicUrl } } = supabase.storage
                .from('avatars')
                .getPublicUrl(filePath)

            // Update user profile
            const { data: updatedUser, error: updateError } = await supabase
                .from('users')
                .update({ photo: publicUrl })
                .eq('id', session.user.id)
                .select()
                .single()

            if (updateError) {
                throw new Error(`Profile update error: ${updateError.message}`)
            }

            // Update local state
            if (updatedUser) {
                setUserData(updatedUser)
            }

            setShowPhotoEdit(false)

        } catch (error) {
            console.error('Error updating photo:', error)
            alert(error instanceof Error ? error.message : 'Error updating photo')
        } finally {
            setIsLoading(false)
        }
    }

    // Handle edit button click
    const handleEditClick = () => {
        setIsEditing(!isEditing);
        setShowNameEdit(false);
        setShowPhotoEdit(false);
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

    if (!userData) {
        return (
            <div className="flex flex-col overflow-hidden items-center justify-center h-full flex-4/6 w-full border-r-[#E5E7EB] border-r-[1px]">
                <Loading text="Loading..." fullScreen={false} />
            </div>
        )
    }

    return (
        <div className="flex flex-row w-full h-full gap-6">
            <div className={clsx("flex h-full flex-col gap-6 flex-4/6", className)}>
                {/* profile */}
                <Card width="w-full">
                    {/* ketika ada user data */}
                    {userData && (
                        <div className="flex felx-row gap-5 items-center justify-start w-full">
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
                <Card width="w-full" padding="p-5" height="h-full" className="h-auto flex flex-col overflow-hidden">
                    <h1 className="text-2xl font-medium text-[#5C8D89]">Laporan Sebelumnya</h1>
                    <div className="flex flex-col gap-4 my-4 overflow-y-auto">
                        {reports.map((report) => (
                            <div key={report.id} className="flex flex-row pb-4 justify-between border-b-[#E5E7EB] border-b-[1px]">
                                <div className="flex flex-col">
                                    <h3 className="text-[#5C8D89] font-medium text-lg">Report <div id={report.id}></div></h3>
                                    <p>Submitted on {new Date(report.created_at).toLocaleDateString()}</p>
                                </div>
                                {report.status === "Resolved" ? (
                                    <Tag color="text-[#065F46]" bgColor="bg-[#D1FAE5]">
                                        {report.status}
                                    </Tag>
                                ) : (
                                    <Tag color="text-[#B45309]" bgColor="bg-[#FEF3C7]">
                                        {report.status}
                                    </Tag>
                                )}
                            </div>
                        ))}
                    </div>
                </Card>
            </div>
            <DashboardMessage className="flex-2/6" />
        </div>
    );
}

// message
export function DashboardMessage({ className }: DbMessage) {
    const supabase = createClientComponentClient<Database>()
    const [messages, setMessages] = useState<Message[]>([])

    useEffect(() => {
        async function fetchMessages() {
            const { data: { session } } = await supabase.auth.getSession()
            if (!session) return

            const { data: messagesData, error } = await supabase
                .from('chats')
                .select(`
                    id,
                    message,
                    created_at,
                    sender:sender_id (
                        id,
                        full_name
                    )
                `)
                .order('created_at', { ascending: false })
                .limit(10)

            if (error) {
                console.error('Error fetching messages:', error)
                return
            }

            if (messagesData) {
                setMessages(messagesData as unknown as Message[])
            } else {
                setMessages([])
            }
        }

        fetchMessages()

        // Subscribe to new messages
        const channel = supabase
            .channel('new_messages')
            .on('postgres_changes', {
                event: 'INSERT',
                schema: 'public',
                table: 'chats'
            }, payload => {
                setMessages(current => [payload.new as Message, ...current])
            })
            .subscribe()

        return () => {
            supabase.removeChannel(channel)
        }
    }, [supabase])

    return (
        <div className={clsx("", className)}>
            <Card width="w-full" height="h-full" className="flex flex-col overflow-hidden">
                <h1 className="text-2xl font-medium text-[#5C8D89]">Pesan</h1>
                <div className="flex flex-col gap-4 my-4 h-auto overflow-y-scroll">
                    {messages.map((message, index) => (
                        <div key={index} className="flex flex-row w-full gap-3 bg-[#F4F9F4] rounded-lg p-4">
                            <div className="flex flex-col gap-2">
                                <h3 className="text-[#5C8D89] font-medium text-lg">
                                    {message.sender.full_name}
                                </h3>
                                <p className="truncate max-w-[230px] overflow-hidden">
                                    {message.message}
                                </p>
                                <p className="text-[#6B7280]">
                                    {new Date(message.created_at).toLocaleDateString()}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </Card>
        </div>
    )
}