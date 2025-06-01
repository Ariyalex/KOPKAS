'use client'

import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { Search, X } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";
import { Input, InputGroup } from "rsuite";

interface ChatsAdminProps {
    onSelectChat?: (chatId: string) => void; // Now passes conversation_id
    activeChatId?: string;
}

interface User {
    id: string;
    email: string;
    full_name: string;
    role: string;
    photo?: string;
}

interface Conversation {
    id: string;
    admin_id: string | null; // Now nullable for general conversations
    user_id: string;
    created_at: string;
    status?: string;
    last_admin_reply_id?: string | null;
}

interface ConversationWithUser extends Conversation {
    user: User;
}

interface ChatSummary {
    conversationId: string;
    userId: string;
    user: User;
    lastMessage: string;
    lastMessageTime: string;
    unreadCount: number;
    isLastMessageFromAdmin: boolean;
    lastAdminName?: string;
}

export function ChatsAdmin({ onSelectChat, activeChatId }: ChatsAdminProps) {
    const supabase = createClientComponentClient();

    // State management
    const [searchQuery, setSearchQuery] = useState<string>('');
    const [chats, setChats] = useState<ChatSummary[]>([]);
    const [currentAdmin, setCurrentAdmin] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Filter chats based on search query
    const filteredChats = chats.filter(chat => {
        if (!searchQuery) return true;
        const query = searchQuery.toLowerCase();
        return chat.user.full_name.toLowerCase().includes(query) ||
            chat.user.email.toLowerCase().includes(query) ||
            chat.lastMessage.toLowerCase().includes(query);
    });

    // Handle search input change
    const handleSearchChange = (value: string) => {
        setSearchQuery(value);
    };

    // Handle clear search
    const handleClearSearch = () => {
        setSearchQuery('');
    };

    // Get current admin user
    const getCurrentAdmin = async () => {
        try {
            const { data: { user: authUser }, error: authError } = await supabase.auth.getUser();

            if (authError || !authUser) {
                setError('Admin tidak terautentikasi');
                return null;
            }

            const { data: userData, error: userError } = await supabase
                .from('users')
                .select('*')
                .eq('id', authUser.id)
                .single();

            if (userError || !userData) {
                setError('Data admin tidak ditemukan');
                return null;
            }

            if (userData.role !== 'admin') {
                setError('Akses ditolak: Hanya admin yang bisa menggunakan fitur ini');
                return null;
            }

            setCurrentAdmin(userData);
            return userData;
        } catch (error) {
            console.error('Error getting current admin:', error);
            setError('Gagal mengambil data admin');
        }
        return null;
    };

    // Fetch all general conversations (where admin_id is NULL)
    const fetchConversations = async () => {
        try {
            setError(null);

            if (!currentAdmin) {
                setChats([]);
                setIsLoading(false);
                return;
            }

            console.log('Fetching all general conversations for admin dashboard');

            // Get all general conversations (admin_id = NULL) with user data
            const { data: conversationsData, error: conversationsError } = await supabase
                .from('chat_conversations')
                .select(`
                    *,
                    user:users!chat_conversations_user_id_fkey(*)
                `)
                .is('admin_id', null) // Only general conversations
                .eq('status', 'active') // Only active conversations
                .order('created_at', { ascending: false });

            if (conversationsError) {
                console.error('Error fetching conversations:', conversationsError);
                setError(`Gagal mengambil data percakapan: ${conversationsError.message}`);
                return;
            }

            if (!conversationsData || conversationsData.length === 0) {
                console.log('No general conversations found');
                setChats([]);
                return;
            }

            console.log('Found general conversations:', conversationsData.length);

            // Process each conversation to get chat summary
            const chatSummaries: ChatSummary[] = [];

            for (const conversation of conversationsData) {
                if (!conversation.user) continue;

                // Get last message for this conversation
                const { data: lastMessageData, error: lastMessageError } = await supabase
                    .from('chats')
                    .select(`
                        *,
                        sender:users!chats_sender_id_fkey(*)
                    `)
                    .eq('conversation_id', conversation.id)
                    .order('created_at', { ascending: false })
                    .limit(1)
                    .single();

                // If no messages in conversation, still show it
                if (lastMessageError || !lastMessageData) {
                    chatSummaries.push({
                        conversationId: conversation.id,
                        userId: conversation.user_id,
                        user: conversation.user,
                        lastMessage: 'Percakapan dimulai - belum ada pesan',
                        lastMessageTime: conversation.created_at,
                        unreadCount: 0,
                        isLastMessageFromAdmin: false
                    });
                    continue;
                }

                // Count unread messages (messages from user after current admin's last message)
                let unreadCount = 0;

                // Get current admin's last message in this conversation
                const { data: adminLastMessage, error: adminLastError } = await supabase
                    .from('chats')
                    .select('created_at')
                    .eq('conversation_id', conversation.id)
                    .eq('sender_id', currentAdmin.id)
                    .order('created_at', { ascending: false })
                    .limit(1)
                    .single();

                if (!adminLastError && adminLastMessage) {
                    // Count user messages after this admin's last message
                    const { data: unreadMessages, error: unreadError } = await supabase
                        .from('chats')
                        .select('id')
                        .eq('conversation_id', conversation.id)
                        .eq('sender_id', conversation.user_id)
                        .gt('created_at', adminLastMessage.created_at);

                    unreadCount = unreadError ? 0 : (unreadMessages?.length || 0);
                } else {
                    // If this admin hasn't sent any message, count all user messages
                    const { data: allUserMessages, error: allUserError } = await supabase
                        .from('chats')
                        .select('id')
                        .eq('conversation_id', conversation.id)
                        .eq('sender_id', conversation.user_id);

                    unreadCount = allUserError ? 0 : (allUserMessages?.length || 0);
                }

                // Get last admin who replied (for display)
                let lastAdminName = undefined;
                if (lastMessageData.sender && lastMessageData.sender.role === 'admin') {
                    lastAdminName = lastMessageData.sender.full_name;
                }

                chatSummaries.push({
                    conversationId: conversation.id,
                    userId: conversation.user_id,
                    user: conversation.user,
                    lastMessage: lastMessageData.message,
                    lastMessageTime: lastMessageData.created_at,
                    unreadCount: unreadCount,
                    isLastMessageFromAdmin: lastMessageData.sender?.role === 'admin',
                    lastAdminName: lastAdminName
                });
            }

            // Sort by last message time (most recent first)
            chatSummaries.sort((a, b) =>
                new Date(b.lastMessageTime).getTime() - new Date(a.lastMessageTime).getTime()
            );

            console.log('Processed chat summaries:', chatSummaries.length);
            setChats(chatSummaries);

        } catch (error) {
            console.error('Error in fetchConversations:', error);
            setError('Gagal memuat daftar percakapan');
        } finally {
            setIsLoading(false);
        }
    };

    // Format time for display
    const formatTime = (timestamp: string) => {
        const date = new Date(timestamp);
        const now = new Date();
        const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));

        if (diffInHours < 1) {
            const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
            if (diffInMinutes < 1) return "Baru saja";
            return `${diffInMinutes}m`;
        }
        if (diffInHours < 24) return `${diffInHours}h`;

        const diffInDays = Math.floor(diffInHours / 24);
        if (diffInDays < 7) return `${diffInDays}d`;

        return date.toLocaleDateString('id-ID', {
            day: 'numeric',
            month: 'short'
        });
    };

    // Initialize component
    useEffect(() => {
        const initialize = async () => {
            setIsLoading(true);
            await getCurrentAdmin();
        };

        initialize();
    }, []);

    // Fetch conversations when admin is ready
    useEffect(() => {
        if (currentAdmin) {
            fetchConversations();
        }
    }, [currentAdmin]);

    // Setup real-time subscription for new messages and conversations
    useEffect(() => {
        if (!currentAdmin) return;

        console.log('Setting up real-time subscription for all general conversations');

        const channel = supabase
            .channel('admin_all_conversations_' + currentAdmin.id)
            .on(
                'postgres_changes',
                {
                    event: 'INSERT',
                    schema: 'public',
                    table: 'chats'
                },
                (payload) => {
                    const newMessage = payload.new as any;

                    // Only process messages from general conversations (admin_id = null)
                    if (newMessage.admin_id !== null) return;

                    console.log('New message received in general conversation:', newMessage);

                    // Refresh conversations to update last message and unread count
                    fetchConversations();
                }
            )
            .on(
                'postgres_changes',
                {
                    event: 'INSERT',
                    schema: 'public',
                    table: 'chat_conversations'
                },
                (payload) => {
                    const newConversation = payload.new as any;

                    // Only process new general conversations (admin_id = null)
                    if (newConversation.admin_id !== null) return;

                    console.log('New general conversation created:', newConversation);

                    // Refresh conversations list
                    fetchConversations();
                }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, [currentAdmin]);

    // Handle chat selection
    const handleChatSelect = (conversationId: string) => {
        if (onSelectChat) {
            // Pass conversation ID to parent component
            onSelectChat(conversationId);
        }
    };

    // Show error state
    if (error && !isLoading) {
        return (
            <div className="flex flex-col h-full flex-2/6 gap-4 bg-white px-5 py-3 border-l border-gray-200">
                <h1 className="text-2xl text-black font-medium">Chats</h1>
                <div className="flex items-center justify-center flex-1">
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
            </div>
        );
    }

    // Show loading state
    if (isLoading) {
        return (
            <div className="flex flex-col h-full flex-2/6 gap-4 bg-white px-5 py-3 border-l border-gray-200">
                <h1 className="text-2xl text-black font-medium">Chats</h1>
                <div className="flex items-center justify-center flex-1">
                    <p className="text-gray-500">Memuat percakapan...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col h-full w-full gap-4 bg-white px-5 py-3 border-l border-gray-200">
            <div className="flex flex-col gap-3">
                <h1 className="text-2xl text-black font-medium">Support Chats</h1>
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
                {filteredChats.length === 0 ? (
                    <div className="flex items-center justify-center py-8">
                        <p className="text-gray-500">
                            {searchQuery ? 'Tidak ada percakapan yang ditemukan' : 'Belum ada percakapan support masuk'}
                        </p>
                    </div>
                ) : (
                    filteredChats.map(chat => (
                        <div
                            key={chat.conversationId}
                            className={`flex items-center gap-3 p-3 border-b border-gray-100 hover:bg-[#F4F9F4] cursor-pointer transition-colors ${chat.conversationId === activeChatId ? 'bg-[#F4F9F4]' : ''
                                }`}
                            onClick={() => handleChatSelect(chat.conversationId)}
                        >
                            <div className="relative">
                                <Image
                                    src={chat.user.photo || '/default-avatar.png'}
                                    alt={chat.user.full_name}
                                    width={50}
                                    height={50}
                                    className="rounded-full object-cover w-[50px] h-[50px]"
                                />
                                {chat.unreadCount > 0 && (
                                    <div className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
                                        {chat.unreadCount > 9 ? '9+' : chat.unreadCount}
                                    </div>
                                )}
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="flex justify-between items-start">
                                    <h3 className="font-medium text-gray-800 truncate">
                                        {chat.user.full_name || chat.user.email}
                                    </h3>
                                    <span className="text-xs text-gray-500 shrink-0 ml-2">
                                        {formatTime(chat.lastMessageTime)}
                                    </span>
                                </div>
                                <div className="flex items-center gap-1">
                                    {chat.isLastMessageFromAdmin && chat.lastAdminName && (
                                        <span className="text-xs text-[#74B49B]">{chat.lastAdminName}: </span>
                                    )}
                                    <p className={`text-sm text-gray-600 truncate ${chat.unreadCount > 0 && !chat.isLastMessageFromAdmin ? 'font-semibold' : ''
                                        }`}>
                                        {chat.lastMessage}
                                    </p>
                                </div>
                                {chat.unreadCount > 0 && (
                                    <p className="text-xs text-orange-600 font-medium">
                                        {chat.unreadCount} pesan baru dari user
                                    </p>
                                )}
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}