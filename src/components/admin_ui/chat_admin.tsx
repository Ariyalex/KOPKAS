'use client'

import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { ClassValue, clsx } from "clsx";
import { MessageCircle, Users } from "lucide-react";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { FilledButton } from "../common/button";
import { Loading } from "../common/loading";

interface ChatProps {
    activeChatId?: string; // conversation_id (UUID)
    className?: ClassValue;
}

interface Message {
    id: string;
    sender_id: string;
    recipient_id: string | null;
    message: string;
    created_at: string;
    conversation_id: string;
}

interface User {
    id: string;
    email: string;
    full_name: string;
    role: string;
    photo?: string;
}

interface MessageWithUser extends Message {
    sender: User;
}

interface Conversation {
    id: string;
    admin_id: string | null; // Now nullable for general conversations
    user_id: string;
    created_at: string;
    status?: string;
    last_admin_reply_id?: string | null;
}

// Helper function to validate UUID
const isValidUUID = (str: string): boolean => {
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    return uuidRegex.test(str);
};

export function ChatAdmin({ activeChatId, className }: ChatProps) {
    const supabase = createClientComponentClient();

    // State untuk menyimpan pesan yang diketik
    const [inputMessage, setInputMessage] = useState("");
    // State untuk menyimpan semua pesan dengan data user
    const [messages, setMessages] = useState<MessageWithUser[]>([]);
    // State untuk user yang sedang login (admin)
    const [currentUser, setCurrentUser] = useState<User | null>(null);
    // State untuk user yang sedang dichat (target user)
    const [targetUser, setTargetUser] = useState<User | null>(null);
    // State untuk conversation yang aktif
    const [activeConversation, setActiveConversation] = useState<Conversation | null>(null);
    // State untuk loading
    const [isLoadingAdmin, setIsLoadingAdmin] = useState(true); // Loading admin authentication
    const [isLoadingChat, setIsLoadingChat] = useState(false); // Loading chat data
    const [isSending, setIsSending] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Ref untuk scroll pesan
    const messagesEndRef = useRef<HTMLDivElement>(null);

    // Check if we have a valid activeChatId
    const hasValidChatId = activeChatId && activeChatId.trim() !== '' && isValidUUID(activeChatId);

    // Scroll ke bawah saat pesan berubah
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    // Fungsi untuk mendapatkan user yang sedang login
    const getCurrentUser = async () => {
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

            // Pastikan yang login adalah admin
            if (userData.role !== 'admin') {
                setError('Akses ditolak: Hanya admin yang bisa menggunakan fitur ini');
                return null;
            }

            setCurrentUser(userData);
            return userData;
        } catch (error) {
            console.error('Error getting current user:', error);
            setError('Gagal mengambil data admin');
        }
        return null;
    };

    // Fungsi untuk mendapatkan conversation by ID
    const getConversationById = async (conversationId: string) => {
        try {
            console.log('🔍 Getting conversation by ID:', conversationId);

            const { data: conversation, error } = await supabase
                .from('chat_conversations')
                .select('*')
                .eq('id', conversationId)
                .single();

            if (error) {
                console.error('Error getting conversation:', error);
                setError('Percakapan tidak ditemukan');
                return null;
            }

            // Verify this is a general conversation (admin_id should be null)
            if (conversation.admin_id !== null) {
                console.log('⚠️ This is not a general conversation, admin_id:', conversation.admin_id);
                // Still allow it, but this indicates old data structure
            }

            console.log('✅ Found conversation:', conversation);
            setActiveConversation(conversation);
            return conversation;
        } catch (error) {
            console.error('Error in getConversationById:', error);
            setError('Gagal mengambil data percakapan');
            return null;
        }
    };

    // Fungsi untuk mendapatkan target user dari conversation
    const getTargetUser = async (conversation: Conversation) => {
        try {
            console.log('🔍 Getting target user:', conversation.user_id);

            const { data: userData, error: userError } = await supabase
                .from('users')
                .select('*')
                .eq('id', conversation.user_id)
                .single();

            if (userError || !userData) {
                console.error('Target user not found:', userError);
                setError('User tidak ditemukan');
                return null;
            }

            console.log('✅ Found target user:', userData.full_name);
            setTargetUser(userData);
            return userData;
        } catch (error) {
            console.error('Error getting target user:', error);
            setError('Gagal mengambil data user');
            return null;
        }
    };

    // Fungsi untuk mengambil pesan dari database
    const fetchMessages = async () => {
        try {
            if (!currentUser || !activeConversation) {
                setMessages([]);
                return;
            }

            console.log('📨 Fetching messages for conversation:', activeConversation.id);

            // Ambil semua chat untuk conversation ini
            const { data: chatsData, error: chatsError } = await supabase
                .from('chats')
                .select('*')
                .eq('conversation_id', activeConversation.id)
                .order('created_at', { ascending: true });

            if (chatsError) {
                console.error('Error fetching chats:', chatsError);
                setError(`Gagal mengambil pesan: ${chatsError.message}`);
                return;
            }

            if (!chatsData || chatsData.length === 0) {
                console.log('📭 No messages found');
                setMessages([]);
                return;
            }

            // Ambil data semua users yang terlibat sebagai sender
            const senderIds = [...new Set(chatsData.map(chat => chat.sender_id))];
            console.log('👥 Fetching users for sender IDs:', senderIds);

            const { data: usersData, error: usersError } = await supabase
                .from('users')
                .select('*')
                .in('id', senderIds);

            if (usersError) {
                console.error('Error fetching users:', usersError);
                setError(`Gagal mengambil data user: ${usersError.message}`);
                return;
            }

            // Gabungkan data chat dengan user sender
            const messagesWithUsers = chatsData.map(chat => {
                const sender = usersData?.find(user => user.id === chat.sender_id);
                return {
                    ...chat,
                    sender: sender || {
                        id: chat.sender_id,
                        email: 'Unknown User',
                        full_name: 'Unknown User',
                        role: 'user',
                        photo: null
                    }
                };
            });

            console.log('✅ Messages loaded:', messagesWithUsers.length);
            setMessages(messagesWithUsers);

        } catch (error) {
            console.error('Error in fetchMessages:', error);
            setError('Gagal memuat pesan');
        }
    };

    // Fungsi untuk mengirim pesan sebagai admin
    const handleSendMessage = async () => {
        if (!inputMessage.trim() || !currentUser || !targetUser || !activeConversation || isSending) return;

        setIsSending(true);

        try {
            console.log('📤 Admin sending message to general conversation:', {
                sender_id: currentUser.id,
                recipient_id: targetUser.id,
                admin_id: null, // General conversation
                message: inputMessage.trim(),
                conversation_id: activeConversation.id
            });

            const messageData = {
                sender_id: currentUser.id,
                recipient_id: targetUser.id, // Target the user
                admin_id: null, // General conversation
                message: inputMessage.trim(),
                conversation_id: activeConversation.id
            };

            const { data, error } = await supabase
                .from('chats')
                .insert([messageData])
                .select()
                .single();

            if (error) {
                console.error('Error sending message:', error);
                setError(`Gagal mengirim pesan: ${error.message}`);
                return;
            }

            console.log('✅ Message sent successfully:', data.id);

            // Optimistic update
            const newMessageWithUser: MessageWithUser = {
                ...data,
                sender: currentUser
            };

            setMessages(prev => {
                const exists = prev.some(msg => msg.id === data.id);
                if (exists) return prev;
                return [...prev, newMessageWithUser];
            });

            setInputMessage('');

        } catch (error) {
            console.error('Error sending message:', error);
            setError('Gagal mengirim pesan');
        } finally {
            setIsSending(false);
        }
    };

    // Handle tekan enter untuk mengirim pesan
    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
        }
    };

    // Format waktu untuk display
    const formatTime = (timestamp: string) => {
        const date = new Date(timestamp);
        const now = new Date();
        const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));

        if (diffInMinutes < 1) return "Baru saja";
        if (diffInMinutes < 60) return `${diffInMinutes} menit yang lalu`;
        if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)} jam yang lalu`;

        return date.toLocaleDateString('id-ID', {
            day: 'numeric',
            month: 'short',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    // HANYA setup admin authentication saat pertama kali - tidak ada chat loading
    useEffect(() => {
        const initializeAdmin = async () => {
            console.log('🔧 Initializing admin authentication only...');
            setIsLoadingAdmin(true);
            setError(null);

            const user = await getCurrentUser();
            if (user) {
                console.log('✅ Admin authenticated:', user.email);
            } else {
                console.log('❌ Admin authentication failed');
            }

            setIsLoadingAdmin(false);
        };

        initializeAdmin();
    }, []); // Hanya run sekali saat component mount

    // Reset states ketika activeChatId berubah atau kosong
    useEffect(() => {
        console.log('🔄 activeChatId changed:', activeChatId);
        console.log('🔍 hasValidChatId:', hasValidChatId);

        // Selalu reset states dulu
        setTargetUser(null);
        setActiveConversation(null);
        setMessages([]);
        setError(null);
        setIsLoadingChat(false);

        // HANYA load chat data jika ada valid chatId DAN currentUser sudah ready
        if (!hasValidChatId || !currentUser) {
            console.log('💤 No valid chat ID or user not ready, staying in placeholder mode');
            return;
        }

        const loadChatData = async () => {
            console.log('🚀 Loading chat data for conversation:', activeChatId);
            setIsLoadingChat(true);
            setError(null);

            // Get conversation first
            const conversation = await getConversationById(activeChatId);
            if (!conversation) {
                setIsLoadingChat(false);
                return;
            }

            // Then get target user
            const user = await getTargetUser(conversation);
            if (!user) {
                setIsLoadingChat(false);
                return;
            }

            console.log('✅ Chat data loaded successfully');
            setIsLoadingChat(false);
        };

        loadChatData();
    }, [activeChatId, currentUser, hasValidChatId]);

    // Fetch messages HANYA ketika activeConversation ready
    useEffect(() => {
        if (currentUser && activeConversation && hasValidChatId) {
            console.log('📨 Fetching messages for conversation:', activeConversation.id);
            fetchMessages();
        }
    }, [currentUser, activeConversation, hasValidChatId]);

    // Setup real-time subscription HANYA ketika conversation active
    useEffect(() => {
        if (!currentUser || !activeConversation || !hasValidChatId) {
            console.log('💤 No real-time subscription - missing requirements');
            return;
        }

        console.log('🔔 Setting up real-time subscription for:', activeConversation.id);

        const channel = supabase
            .channel('admin_conversation_' + activeConversation.id)
            .on(
                'postgres_changes',
                {
                    event: 'INSERT',
                    schema: 'public',
                    table: 'chats',
                    filter: `conversation_id=eq.${activeConversation.id}`
                },
                async (payload) => {
                    const newMessage = payload.new as Message;

                    console.log('📨 Real-time message received:', newMessage.id);

                    // Ambil data user untuk pesan baru
                    const { data: userData, error: userError } = await supabase
                        .from('users')
                        .select('*')
                        .eq('id', newMessage.sender_id)
                        .single();

                    if (userError) {
                        console.error('Error fetching user for new message:', userError);
                        return;
                    }

                    const newMessageWithUser: MessageWithUser = {
                        ...newMessage,
                        sender: userData
                    };

                    setMessages(prev => {
                        const exists = prev.some(msg => msg.id === newMessage.id);
                        if (exists) return prev;
                        return [...prev, newMessageWithUser];
                    });
                }
            )
            .subscribe((status) => {
                console.log('🔔 Subscription status:', status);
            });

        return () => {
            console.log('🔇 Cleaning up real-time subscription');
            supabase.removeChannel(channel);
        };
    }, [currentUser, activeConversation, hasValidChatId]);

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
                            onClick={() => {
                                setError(null);
                                if (hasValidChatId && currentUser) {
                                    getConversationById(activeChatId!);
                                }
                            }}
                            className="px-4 py-2 bg-[#74B49B] text-white rounded-lg mr-2"
                        >
                            Coba Lagi
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    // MAIN CHAT INTERFACE - Only shows when we have valid chat and all data loaded
    return (
        <div className={clsx("flex flex-col overflow-hidden h-full flex-4/6 w-full border-r-[#E5E7EB] border-r-[1px]", className)}>
            {/* Header Chat */}
            <div className="flex items-center  gap-3 p-4 border-b border-gray-200 bg-white">
                {targetUser && (
                    <div className='flex flex-row w-full'>
                        <div className='flex w-full flex-row gap-3'>
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
                        </div>
                        <div className="text-right sm:block hidden">
                            <p className="text-sm text-gray-600">Support Chat</p>
                            <p className="text-xs text-gray-500">Sebagai: {currentUser?.full_name}</p>
                        </div>
                    </div>
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

                        // Cek apakah pesan dari admin yang sedang login
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
                                    <div className={`px-3 py-1 rounded-lg shadow-sm ${isCurrentUser
                                        ? 'bg-[#74B49B] text-white'
                                        : isFromAdmin
                                            ? 'bg-blue-100 text-blue-900'
                                            : 'bg-white'
                                        }`}>
                                        {!isCurrentUser && (
                                            <h3 className={`font-medium text-lg ${isFromAdmin ? 'text-blue-700' : 'text-[#5C8D89]'
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
                        onClick={handleSendMessage}
                        disabled={!currentUser || !targetUser || !activeConversation || isSending || !inputMessage.trim()}
                    >
                        {isSending ? "..." : "Kirim"}
                    </FilledButton>
                </div>
            </div>
        </div>
    );
}