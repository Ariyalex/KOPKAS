'use client'

import { ChatAdmin } from "@/components/admin_ui/chat_admin";
import { ChatsAdmin } from "@/components/admin_ui/chats_admin";
import { useState, useEffect } from "react";
import { ArrowLeft } from "lucide-react";

export default function Page() {
    const [activeChatId, setActiveChatId] = useState<string>("chat-1");
    const [showChat, setShowChat] = useState<boolean>(false);

    // On larger screens, always show both components
    // On small screens, toggle between chat and chats list
    const handleSelectChat = (chatId: string) => {
        setActiveChatId(chatId);
        setShowChat(true);
    };

    // Handle screen size changes
    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth >= 640) { // sm breakpoint
                setShowChat(false);
            }
        };

        window.addEventListener("resize", handleResize);
        handleResize(); // Initial check

        return () => window.removeEventListener("resize", handleResize);
    }, []);

    return (
        <div className="flex flex-row w-full h-screen">
            <div className={`flex-1 ${showChat ? 'block' : 'hidden'} sm:block sm:flex-3 sm:border-r border-gray-200 relative`}>
                <div className="absolute top-3 left-3 z-10 sm:hidden">
                    {showChat && (
                        <button
                            onClick={() => setShowChat(false)}
                            className="p-2 bg-white h-full"
                            aria-label="Back to chats"
                        >
                            <ArrowLeft size={25} />
                        </button>
                    )}
                </div>
                <ChatAdmin activeChatId={activeChatId} />
            </div>
            <div className={`flex-1 ${!showChat ? 'block' : 'hidden'} sm:block sm:flex-1`}>
                <ChatsAdmin
                    activeChatId={activeChatId}
                    onSelectChat={handleSelectChat}
                />
            </div>
        </div>
    )
}
