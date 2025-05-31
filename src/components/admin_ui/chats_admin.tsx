'use client'

import { Search, X } from "lucide-react";
import { useState } from "react";
import { Input, InputGroup } from "rsuite";
import { DummyUsers, AdminChatsDummy } from "./dummy/chat_dummy";
import Image from "next/image";

interface ChatsAdminProps {
    onSelectChat?: (chatId: string) => void;
    activeChatId?: string;
}

export function ChatsAdmin({ onSelectChat, activeChatId = "chat-1" }: ChatsAdminProps) {
    //controller search
    const [searchQuery, setSearchQuery] = useState<string>('');

    // Filter chats based on search query
    const filteredChats = AdminChatsDummy.filter(chat => {
        const user = DummyUsers.find(u => u.id === chat.userId);
        if (!user) return false;
        return user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            chat.lastMessage.toLowerCase().includes(searchQuery.toLowerCase());
    });

    // Handle search input change
    const handleSearchChange = (value: string) => {
        setSearchQuery(value);
    };

    // Handle clear search
    const handleClearSearch = () => {
        setSearchQuery('');
    };

    // Handle chat selection with additional functionality for responsive design
    const handleChatSelect = (chatId: string) => {
        if (onSelectChat) {
            onSelectChat(chatId);
        }
    };

    return (
        <div className="flex flex-col h-full w-full gap-4 bg-white px-5 py-3 border-l border-gray-200">
            <div className="flex flex-col gap-3">
                <h1 className="text-2xl text-black font-medium">Chats</h1>
                <InputGroup className="w-full">
                    <Input
                        placeholder="Cari user..."
                        value={searchQuery}
                        onChange={handleSearchChange}
                    />
                    <InputGroup.Addon className="bg-[#E6FFFA] cursor-pointer">
                        {searchQuery ? (
                            <X
                                size={16}
                                onClick={handleClearSearch}
                                className="text-white"
                            />
                        ) : (
                            <Search size={16} className="text-white" />
                        )}
                    </InputGroup.Addon>
                </InputGroup>
            </div>
            <div className="flex flex-col overflow-y-auto">
                {filteredChats.map(chat => {
                    const user = DummyUsers.find(u => u.id === chat.userId);
                    if (!user) return null;

                    return (<div
                        key={chat.id}
                        className={`flex items-center gap-3 p-3 border-b border-gray-100 hover:bg-[#F4F9F4] cursor-pointer transition-colors ${chat.id === activeChatId ? 'bg-[#F4F9F4]' : ''}`}
                        onClick={() => handleChatSelect(chat.id)}
                    >
                        <div className="relative">
                            <Image
                                src={user.photo}
                                alt={user.name}
                                width={50}
                                height={50}
                                className="rounded-full object-cover w-[50px] h-[50px]"
                            />
                            {chat.unread > 0 && (
                                <div className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
                                    {chat.unread}
                                </div>
                            )}
                        </div>
                        <div className="flex-1">
                            <div className="flex justify-between">
                                <h3 className="font-medium text-gray-800">{user.name}</h3>
                                <span className="text-xs text-gray-500">{chat.timestamp}</span>
                            </div>
                            <p className="text-sm max-w-[200px] text-gray-600 truncate">{chat.lastMessage}</p>
                        </div>
                    </div>
                    );
                })}
            </div>
        </div>
    )
}