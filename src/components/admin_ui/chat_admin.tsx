'use client'

import { DummyUsers, ChatMessagesDummy } from "./dummy/chat_dummy";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { FilledButton } from "../common/button";

interface ChatProps {
    activeChatId?: string;
}

export function ChatAdmin({ activeChatId = "chat-1" }: ChatProps) {
    //state untuk menyimpan pesan yang diketik
    const [inputMessage, setInputMessage] = useState("");
    //state untuk menyimpan semua pesan
    const [messages, setMessages] = useState<any[]>([]);
    //ref untuk scroll pesan
    const messagesEndRef = useRef<HTMLDivElement>(null);

    // Update messages when activeChatId changes
    useEffect(() => {
        if (activeChatId && ChatMessagesDummy[activeChatId]) {
            setMessages(ChatMessagesDummy[activeChatId].map(msg => ({
                userId: msg.senderId,
                message: msg.content,
                sent: msg.timestamp
            })));
        }
    }, [activeChatId]);

    //scroll ke bawah saat pesan berubah
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    //function untuk menangani pengiriman pesan
    //supabase edit
    const handleSendMessage = () => {
        //message kosong
        if (!inputMessage.trim()) return;

        const newMessage = {
            userId: "admin-1",
            message: inputMessage,
            sent: "Baru saja"
        };

        //menambahkan pesan baru ke daftar pesan
        setMessages([...messages, newMessage]);

        //reset input field
        setInputMessage("");
    };

    //handle tekan enter untuk mengirim pesan
    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === "Enter") {
            handleSendMessage();
        }
    };

    return (
        <div className="flex flex-col overflow-hidden h-full flex-4/6 w-full border-r-[#E5E7EB] border-r-2">
            <div className="overflow-y-auto p-5 flex-1 flex flex-col gap-4 bg-[#F4F9F4]">
                {messages.map((message, index) => {
                    const user = DummyUsers.find(user => user.id === message.userId);
                    if (!user) return null;

                    // Cek apakah pesan dari user (kita sendiri)
                    const isCurrentUser = user.id === "admin-1";

                    return (
                        <div
                            key={index}
                            className={`flex flex-row items-start gap-3 max-w-[65%] ${isCurrentUser ? 'self-end' : ''}`}
                        >
                            {!isCurrentUser && (
                                <Image
                                    src={user.photo}
                                    alt={user.name}
                                    width={40}
                                    height={40}
                                    className="rounded-full object-cover w-[40px] h-[40px]"
                                />
                            )}
                            <div className="flex flex-col">
                                <div className={`px-3 py-1 rounded-lg shadow-sm ${isCurrentUser ? 'bg-[#74B49B] text-white' : 'bg-white'}`}>
                                    {!isCurrentUser && (
                                        <h3 className="text-[#5C8D89] font-medium text-lg">{user.name}</h3>
                                    )}
                                    <p>{message.message}</p>
                                </div>
                                <span className={`text-sm text-gray-500 mt-1 ${isCurrentUser ? 'text-right' : ''}`}>{message.sent}</span>
                            </div>
                        </div>
                    );
                })}
                <div ref={messagesEndRef} />
            </div>
            <div className="p-3 border-t border-gray-200 bg-white">
                <div className="flex gap-2">
                    <input
                        value={inputMessage}
                        onChange={(e) => setInputMessage(e.target.value)}
                        onKeyDown={handleKeyPress}
                        type="text"
                        placeholder="Ketik pesan..."
                        className="flex-1 p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#74B49B]"
                    />
                    <FilledButton
                        paddingx="px-4"
                        paddingy="py-2"
                        onClick={handleSendMessage}
                    >
                        Kirim
                    </FilledButton>
                </div>
            </div>
        </div>

    );
}