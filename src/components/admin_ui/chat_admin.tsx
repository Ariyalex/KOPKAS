'use client'

import { fetchMessages, useChatAdminStore } from "@/stores/chatAdminStore";
import { formatTime } from "@/utils/formatTime";
import { ClassValue, clsx } from "clsx";
import { MessageCircle, Users } from "lucide-react";
import Image from "next/image";
import { useEffect, useRef } from "react";
import { FilledButton } from "../common/button";
import { Loading } from "../common/loading";

interface ChatProps {
    activeChatId?: string;
    className?: ClassValue;
}

export function ChatAdmin({ activeChatId, className }: ChatProps) {
    // Zustand store
    const {
        currentUser,
        targetUser,
        activeConversation,
        messages,
        inputMessage,
        isLoadingAdmin,
        isLoadingChat,
        isSending,
        error,
        setActiveChatId,
        setInputMessage,
        initializeAdmin,
        sendMessage,
        setupRealTimeSubscription,
        clearError
    } = useChatAdminStore();

    // Ref untuk scroll pesan
    const messagesEndRef = useRef<HTMLDivElement>(null);

    // Helper to check if we have valid chat ID
    const hasValidChatId = activeChatId && activeChatId.trim() !== '' && 
        /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(activeChatId);

    // Auto-scroll to bottom when messages change
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    // Initialize admin on component mount
    useEffect(() => {
        initializeAdmin();
    }, [initializeAdmin]);

    // Handle activeChatId changes
    useEffect(() => {
        setActiveChatId(activeChatId || null);
    }, [activeChatId, setActiveChatId]);

    // Fetch messages when conversation is ready
    useEffect(() => {
        if (currentUser && activeConversation && hasValidChatId) {
            fetchMessages();
        }
    }, [currentUser, activeConversation, hasValidChatId]);

    // Setup real-time subscription
    useEffect(() => {
        let cleanup: (() => void) | undefined;
        
        if (currentUser && activeConversation && hasValidChatId) {
            cleanup = setupRealTimeSubscription();
        }

        return () => {
            if (cleanup) cleanup();
        };
    }, [currentUser, activeConversation, hasValidChatId, setupRealTimeSubscription]);

    // Handle key press for sending messages
    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    };

    // Loading state untuk admin authentication
    if (isLoadingAdmin) {
        return (
            <div className="flex flex-col overflow-hidden items-center justify-center h-full flex-4/6 w-full border-r-[#E5E7EB] border-r-[1px]">
                <Loading text="Memuat..." fullScreen={false} />
            </div>
        );
    }

    // Error state untuk admin authentication
    if (error && !currentUser) {
        return (
            <div className="flex flex-col overflow-hidden items-center justify-center h-full flex-4/6 w-full border-r-[#E5E7EB] border-r-[1px]">
                <div className="text-center">
                    <p className="text-red-500 mb-2">{error}</p>
                    <button 
                        onClick={() => window.location.reload()} 
                        className="px-4 py-2 bg-[#74B49B] text-white rounded-lg"
                    >
                        Refresh
                    </button>
                </div>
            </div>
        );
    }

    // DEFAULT STATE - Show placeholder when no valid chat is selected
    if (!hasValidChatId) {
        return (
            <div className={clsx("flex flex-col overflow-hidden h-full flex-4/6 w-full border-r-[#E5E7EB] border-r-[1px]", className)}>
                {/* Header */}
                <div className="flex items-center gap-3 p-4 border-b border-gray-200 bg-white">
                    <h3 className="font-medium text-gray-800">Panel Support Admin</h3>
                </div>

                {/* Empty State */}
                <div className="flex-1 flex flex-col items-center justify-center bg-[#F4F9F4] p-8">
                    <div className="text-center max-w-md">
                        <div className="w-16 h-16 bg-[#74B49B] rounded-full flex items-center justify-center mx-auto mb-4">
                            <MessageCircle size={32} className="text-white" />
                        </div>
                        <h3 className="text-xl font-semibold text-gray-800 mb-2">
                            Pilih Percakapan Support
                        </h3>
                        <p className="text-gray-600 mb-4">
                            Pilih salah satu percakapan dari daftar di samping untuk membantu user yang memerlukan bantuan.
                        </p>
                        <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
                            <Users size={16} />
                            <span>Sebagai admin, Anda bisa membantu semua user yang memerlukan support</span>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // Loading state untuk chat data
    if (isLoadingChat) {
        return (
            <div className={clsx("flex flex-col overflow-hidden h-full flex-4/6 w-full border-r-[#E5E7EB] border-r-[1px]", className)}>
                {/* Header */}
                <div className="flex items-center gap-3 p-4 border-b border-gray-200 bg-white">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gray-200 rounded-full animate-pulse"></div>
                        <div>
                            <div className="w-20 h-4 bg-gray-200 rounded animate-pulse mb-1"></div>
                            <div className="w-16 h-3 bg-gray-200 rounded animate-pulse"></div>
                        </div>
                    </div>
                </div>

                {/* Loading */}
                <div className="flex-1 flex items-center justify-center bg-[#F4F9F4]">
                    <Loading text="Memuat percakapan..." fullScreen={false} />
                </div>
            </div>
        );
    }

    // Error state untuk chat data
    if (error && hasValidChatId) {
        return (
            <div className={clsx("flex flex-col overflow-hidden h-full flex-4/6 w-full border-r-[#E5E7EB] border-r-[1px]", className)}>
                {/* Header */}
                <div className="flex items-center gap-3 p-4 border-b border-gray-200 bg-white">
                    <h3 className="font-medium text-gray-800">Error</h3>
                </div>

                {/* Error State */}
                <div className="flex-1 flex items-center justify-center bg-[#F4F9F4] p-8">
                    <div className="text-center">
                        <p className="text-red-500 mb-2">{error}</p>
                        <button 
                            onClick={clearError}
                            className="px-4 py-2 bg-[#74B49B] text-white rounded-lg mr-2"
                        >
                            Coba Lagi
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    // MAIN CHAT INTERFACE
    return (
        <div className={clsx("flex flex-col overflow-hidden h-full flex-4/6 w-full border-r-[#E5E7EB] border-r-[1px]", className)}>
            {/* Header Chat */}
            <div className="flex items-center gap-3 p-4 border-b border-gray-200 bg-white">
                {targetUser && (
                    <>
                        <Image
                            src={targetUser.photo || '/default-avatar.png'}
                            alt={targetUser.full_name}
                            width={40}
                            height={40}
                            className="rounded-full object-cover w-[40px] h-[40px]"
                        />
                        <div className="flex-1">
                            <h3 className="font-medium text-gray-800">{targetUser.full_name}</h3>
                            <p className="text-sm text-gray-500">{targetUser.email}</p>
                        </div>
                        <div className="text-right">
                            <p className="text-sm text-gray-600">Support Chat</p>
                            <p className="text-xs text-gray-500">Sebagai: {currentUser?.full_name}</p>
                        </div>
                    </>
                )}
            </div>

            {/* Messages Area */}
            <div className="overflow-y-auto p-5 flex-1 flex flex-col gap-4 bg-[#F4F9F4]">
                {messages.length === 0 ? (
                    <div className="flex items-center justify-center h-full">
                        <div className="text-center">
                            <p className="text-gray-500 mb-2">Percakapan support dengan {targetUser?.full_name}</p>
                            <p className="text-gray-400 text-sm">Belum ada pesan dalam percakapan ini.</p>
                        </div>
                    </div>
                ) : (
                    messages.map((message) => {
                        const user = message.sender;
                        if (!user) return null;

                        const isCurrentUser = currentUser && user.id === currentUser.id;
                        const isFromAdmin = user.role === 'admin';

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
                                    <div className={`px-3 py-1 rounded-lg shadow-sm ${
                                        isCurrentUser 
                                            ? 'bg-[#74B49B] text-white' 
                                            : isFromAdmin 
                                                ? 'bg-blue-100 text-blue-900' 
                                                : 'bg-white'
                                    }`}>
                                        {!isCurrentUser && (
                                            <h3 className={`font-medium text-lg ${
                                                isFromAdmin ? 'text-blue-700' : 'text-[#5C8D89]'
                                            }`}>
                                                {isFromAdmin 
                                                    ? `${user.full_name} (Admin)` 
                                                    : (user.full_name || user.email)
                                                }
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

            {/* Input Area */}
            <div className="p-3 border-t border-gray-200 bg-white">
                <div className="flex gap-2">
                    <input
                        value={inputMessage}
                        onChange={(e) => setInputMessage(e.target.value)}
                        onKeyDown={handleKeyPress}
                        type="text"
                        placeholder={targetUser ? `Balas ${targetUser.full_name} sebagai admin...` : "Ketik pesan sebagai admin..."}
                        disabled={!currentUser || !targetUser || !activeConversation || isSending}
                        className="flex-1 p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#74B49B] disabled:bg-gray-100"
                    />
                    <FilledButton
                        paddingx="px-4"
                        paddingy="py-2"
                        onClick={sendMessage}
                        disabled={!currentUser || !targetUser || !activeConversation || isSending || !inputMessage.trim()}
                    >
                        {isSending ? "..." : "Kirim"}
                    </FilledButton>
                </div>
            </div>
        </div>
    );
}