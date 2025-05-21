'use client'

import { ChatAdmin } from "@/components/admin_ui/chat_admin";
import { ChatsAdmin } from "@/components/admin_ui/chats_admin";
import { useState } from "react";

export default function Page() {
    const [activeChatId, setActiveChatId] = useState<string>("chat-1");

    return (
        <div className="flex flex-row flex-5/6 w-full h-screen">
            <ChatAdmin activeChatId={activeChatId} />
            <ChatsAdmin
                activeChatId={activeChatId}
                onSelectChat={(chatId) => setActiveChatId(chatId)}
            />
        </div>
    )
}