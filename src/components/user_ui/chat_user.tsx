'use client'

import { ClassValue, clsx } from "clsx";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { FilledButton } from "../common/button";
import { Card } from "../common/card";
import { DummyUserContent, MessagesContentDummy } from "./dummy/chat_dummy";

interface ChatProps {
    className?: ClassValue;
}

export function ChatUser({ className }: ChatProps) {
    //state untuk menyimpan pesan yang diketik
    const [inputMessage, setInputMessage] = useState("");
    //state untuk menyimpan semua pesan
    const [messages, setMessages] = useState(MessagesContentDummy);
    //ref untuk scroll pesan
    const messagesEndRef = useRef<HTMLDivElement>(null);

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
            userId: "user-1",
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
        <Card
            padding="p-0"
            className={clsx("flex flex-col h-full ", className)}
        >
            <div className="flex flex-row gap-4 py-3 px-5 w-full items-center border-b-2 border-b-[#E5E7EB]">
                <h1 className="text-[#5C8D89] font-bold text-2xl">Chatbox</h1>
            </div>
            <div className="flex flex-col flex-1 overflow-hidden ">
                <div className="overflow-y-auto p-5 flex-1 flex flex-col gap-4 bg-[#F4F9F4]">
                    {messages.map((message, index) => {
                        const user = DummyUserContent.find(user => user.id === message.userId);
                        if (!user) return null;

                        // Cek apakah pesan dari user (kita sendiri)
                        const isCurrentUser = user.role === "user";

                        return (
                            <div
                                key={index}
                                className={`flex flex-row items-start gap-3 max-w-[70%] ${isCurrentUser ? 'self-end' : ''}`}
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

        </Card>
    );
}