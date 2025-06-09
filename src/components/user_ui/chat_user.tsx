'use client'

import { fetchMessages, setupConversation, useChatUserStore } from "@/stores/chatUserStore";
import { formatTime } from "@/utils/formatTime";
import { ClassValue, clsx } from "clsx";
import Image from "next/image";
import { useEffect, useRef } from "react";
import { FilledButton } from "../common/button";
import { Card } from "../common/card";

interface ChatProps {
    className?: ClassValue;
}

export function ChatUser({ className }: ChatProps) {
    const {
        currentUser,
        activeConversation,
        lastReplyingAdmin,
        messages,
        inputMessage,
        isLoading,
        isSending,
        error,
        setInputMessage,
        initializeChat,
        sendMessage,
        setupRealTimeSubscription,
        clearError
    } = useChatUserStore();

    const messagesEndRef = useRef<HTMLDivElement>(null);

    // Auto-scroll to bottom when messages change
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    // Initialize chat on component mount
    useEffect(() => {
        initializeChat();
    }, [initializeChat]);

    // ✅ OPTIMASI: Gabungkan setup conversation dan fetch messages dalam satu useEffect
    useEffect(() => {
        if (currentUser && !activeConversation) {
            setupConversation();
        }
    }, [currentUser]);

    // ✅ OPTIMASI: Setup real-time subscription hanya ketika conversation ready
    useEffect(() => {
        let cleanup: (() => void) | undefined;
        
        if (currentUser && activeConversation) {
            // Fetch messages terlebih dahulu
            fetchMessages().then(() => {
                // Setelah messages loaded, setup real-time
                cleanup = setupRealTimeSubscription();
            });
        }

        return () => {
            if (cleanup) cleanup();
        };
    }, [currentUser, activeConversation]);

    // ✅ TAMBAHKAN: Loading state yang lebih specific
    const isInitializing = isLoading && !currentUser;
    const isLoadingMessages = isLoading && currentUser && !messages.length;

    // Handle key press for sending messages
    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    };

    // Handle retry button
    const handleRetry = () => {
        clearError();
        if (currentUser) {
            setupConversation();
        } else {
            initializeChat();
        }
    };

    // ✅ PERBAIKI: Error state dengan informasi lebih detail
    if (error && !isLoading) {
        return (
            <Card padding="p-0" className={clsx("flex flex-col h-full ", className)}>
                <div className="flex flex-row gap-4 py-3 px-5 w-full items-center border-b-2 border-b-[#E5E7EB]">
                    <h1 className="text-[#5C8D89] font-bold text-2xl">Chatbox</h1>
                </div>
                <div className="flex items-center justify-center flex-1 p-5">
                    <div className="text-center">
                        <p className="text-red-500 mb-2">{error}</p>
                        <div className="space-y-2">
                            <button 
                                onClick={handleRetry}
                                className="px-4 py-2 bg-[#74B49B] text-white rounded-lg mr-2"
                            >
                                Coba Lagi
                            </button>
                            <button 
                                onClick={() => window.location.reload()} 
                                className="px-4 py-2 bg-gray-500 text-white rounded-lg"
                            >
                                Refresh
                            </button>
                        </div>
                    </div>
                </div>
            </Card>
        );
    }

    // ✅ PERBAIKI: Loading state dengan pesan yang lebih specific
    if (isInitializing) {
        return (
            <Card padding="p-0" className={clsx("flex flex-col h-full ", className)}>
                <div className="flex flex-row gap-4 py-3 px-5 w-full items-center border-b-2 border-b-[#E5E7EB]">
                    <h1 className="text-[#5C8D89] font-bold text-2xl">Chatbox</h1>
                </div>
                <div className="flex items-center justify-center flex-1">
                    <p className="text-gray-500">Menginisialisasi chat...</p>
                </div>
            </Card>
        );
    }

    if (isLoadingMessages) {
        return (
            <Card padding="p-0" className={clsx("flex flex-col h-full ", className)}>
                <div className="flex flex-row gap-4 py-3 px-5 w-full items-center border-b-2 border-b-[#E5E7EB]">
                    <h1 className="text-[#5C8D89] font-bold text-2xl">Chatbox</h1>
                </div>
                <div className="flex items-center justify-center flex-1">
                    <p className="text-gray-500">Memuat pesan...</p>
                </div>
            </Card>
        );
    }

    // ✅ TAMBAHKAN: Tampilkan chat meskipun masih loading (untuk UX yang lebih baik)
    return (
        <Card padding="p-0" className={clsx("flex flex-col h-full ", className)}>
            <div className="flex flex-row gap-4 py-3 px-5 w-full items-center border-b-2 border-b-[#E5E7EB]">
                <h1 className="text-[#5C8D89] font-bold text-2xl">
                    Chat dengan Admin
                </h1>
                {lastReplyingAdmin && (
                    <div className="flex items-center gap-2 ml-auto">
                        <Image
                            src={lastReplyingAdmin.photo || '/default-avatar.png'}
                            alt={lastReplyingAdmin.full_name}
                            width={32}
                            height={32}
                            className="rounded-full object-cover w-[32px] h-[32px]"
                        />
                        <span className="text-sm text-gray-600">
                            Dibantu oleh: {lastReplyingAdmin.full_name}
                        </span>
                    </div>
                )}
                {!lastReplyingAdmin && (
                    <div className="ml-auto">
                        <span className="text-sm text-gray-500">
                            Tim Support Online
                        </span>
                    </div>
                )}
            </div>
            
            <div className="flex flex-col flex-1 overflow-hidden">
                <div className="overflow-y-auto p-5 flex-1 flex flex-col gap-4 bg-[#F4F9F4]">
                    {messages.length === 0 ? (
                        <div className="flex items-center justify-center h-full">
                            <div className="text-center">
                                <p className="text-gray-500 mb-2">Halo! Selamat datang di layanan support kami.</p>
                                <p className="text-gray-400 text-sm">Tim admin siap membantu Anda. Silakan kirim pesan!</p>
                            </div>
                        </div>
                    ) : (
                        messages.map((message) => {
                            const user = message.sender;
                            if (!user) return null;

                            const isCurrentUser = currentUser && user.id === currentUser.id;

                            return (
                                <div
                                    key={message.id}
                                    className={`flex flex-row items-start gap-3 h-fit max-w-[75%] ${isCurrentUser ? 'self-end' : ''}`}
                                >
                                    {!isCurrentUser && (
                                        <Image
                                            src={user.photo || '/default-avatar.png'}
                                            alt={user.full_name || user.email}
                                            width={40}
                                            height={40}
                                            className="rounded-full object-cover shrink-0 w-[40px] h-[40px]"
                                        />
                                    )}
                                    <div className="flex flex-col">
                                        <div className={`px-3 py-1 rounded-lg shadow-sm ${isCurrentUser ? 'bg-[#74B49B] text-white' : 'bg-white'}`}>
                                            {!isCurrentUser && (
                                                <h3 className="text-[#5C8D89] font-medium text-lg">
                                                    {user.role === 'admin' ? `${user.full_name} (Admin)` : (user.full_name || user.email)}
                                                </h3>
                                            )}
                                            <p className="whitespace-pre-wrap">{message.message}</p>
                                        </div>
                                        <span className={`text-sm text-gray-500 mt-1 ${isCurrentUser ? 'text-right' : ''}`}>
                                            {formatTime(message.created_at)}
                                        </span>
                                    </div>
                                </div>
                            );
                        })
                    )}
                    <div ref={messagesEndRef} />
                </div>
                
                <div className="p-3 border-t border-gray-200 bg-white">
                    {error && (
                        <div className="mb-2 p-2 bg-red-100 border border-red-300 rounded text-red-700 text-sm">
                            {error}
                        </div>
                    )}
                    <div className="flex gap-2">
                        <input
                            value={inputMessage}
                            onChange={(e) => setInputMessage(e.target.value)}
                            onKeyDown={handleKeyPress}
                            type="text"
                            placeholder="Ketik pesan untuk tim support..."
                            disabled={!currentUser || !activeConversation || isSending}
                            className="flex-1 p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#74B49B] disabled:bg-gray-100"
                        />
                        <FilledButton
                            paddingx="px-4"
                            paddingy="py-2"
                            onClick={sendMessage}
                            disabled={!currentUser || !activeConversation || isSending || !inputMessage.trim()}
                        >
                            {isSending ? "..." : "Kirim"}
                        </FilledButton>
                    </div>
                </div>
            </div>
        </Card>
    );
}