'use client'

import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { ClassValue, clsx } from "clsx";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { FilledButton } from "../common/button";
import { Card } from "../common/card";

interface ChatProps {
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

export function ChatUser({ className }: ChatProps) {
    const supabase = createClientComponentClient();
    
    // State untuk menyimpan pesan yang diketik
    const [inputMessage, setInputMessage] = useState("");
    // State untuk menyimpan semua pesan dengan data user
    const [messages, setMessages] = useState<MessageWithUser[]>([]);
    // State untuk user yang sedang login
    const [currentUser, setCurrentUser] = useState<User | null>(null);
    // State untuk conversation aktif
    const [activeConversation, setActiveConversation] = useState<Conversation | null>(null);
    // State untuk admin yang terakhir reply (for recipient_id)
    const [lastReplyingAdmin, setLastReplyingAdmin] = useState<User | null>(null);
    // State untuk loading
    const [isLoading, setIsLoading] = useState(true);
    const [isSending, setIsSending] = useState(false);
    const [error, setError] = useState<string | null>(null);
    
    // Ref untuk scroll pesan
    const messagesEndRef = useRef<HTMLDivElement>(null);

    // Scroll ke bawah saat pesan berubah
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    // Fungsi untuk debug dan test koneksi
    const testConnection = async () => {
        try {
            console.log('Testing Supabase connection...');
            
            // Test basic connection
            const { data: testData, error: testError } = await supabase
                .from('users')
                .select('count')
                .limit(1);
                
            console.log('Connection test:', { testData, testError });
            
            // Test auth
            const { data: { user: authUser }, error: authError } = await supabase.auth.getUser();
            console.log('Auth test:', { authUser, authError });
            
            return { success: !testError && !authError, authUser };
        } catch (error) {
            console.error('Connection test failed:', error);
            return { success: false, authUser: null };
        }
    };

    // Fungsi untuk mendapatkan user yang sedang login
    const getCurrentUser = async () => {
        try {
            const { data: { user: authUser }, error: authError } = await supabase.auth.getUser();
            
            console.log('Getting current user:', { authUser, authError });
            
            if (authError) {
                console.error('Auth error:', authError);
                setError('Authentication error');
                return null;
            }
            
            if (!authUser) {
                setError('User not authenticated');
                return null;
            }

            // Coba ambil data user dari table users
            const { data: userData, error: userError } = await supabase
                .from('users')
                .select('*')
                .eq('id', authUser.id)
                .single();

            console.log('User data from users table:', { userData, userError });

            if (userError) {
                console.error('Error fetching user data:', userError);
                // Jika user belum ada di table users, buat user baru
                const newUser = {
                    id: authUser.id,
                    email: authUser.email || '',
                    full_name: authUser.user_metadata?.full_name || authUser.email || 'User',
                    role: 'user', // Default role
                    photo: authUser.user_metadata?.avatar_url || null
                };

                const { data: insertedUser, error: insertError } = await supabase
                    .from('users')
                    .insert([newUser])
                    .select()
                    .single();

                if (insertError) {
                    console.error('Error creating user:', insertError);
                    setError('Failed to create user profile');
                    return null;
                }

                setCurrentUser(insertedUser);
                return insertedUser;
            }

            setCurrentUser(userData);
            return userData;
        } catch (error) {
            console.error('Error getting current user:', error);
            setError('Failed to get user data');
        }
        return null;
    };

    // Fungsi untuk mendapatkan atau membuat conversation (General Support)
    const getOrCreateConversation = async () => {
        if (!currentUser) {
            console.log('❌ Missing currentUser');
            return null;
        }

        try {
            console.log('🔍 Looking for existing general conversation for user:', currentUser.id);

            // Cari conversation umum user (admin_id = NULL)
            const { data: existingConv, error: findError } = await supabase
                .from('chat_conversations')
                .select('*')
                .eq('user_id', currentUser.id)
                .is('admin_id', null)
                .maybeSingle();

            console.log('🔍 Find conversation result:', { existingConv, findError });

            if (findError) {
                console.error('❌ Error finding conversation:', findError);
                setError(`Error mencari percakapan: ${findError.message}`);
                return null;
            }

            if (existingConv) {
                console.log('✅ Found existing general conversation:', existingConv.id);
                setActiveConversation(existingConv);
                return existingConv;
            }

            // Jika belum ada, buat conversation umum baru
            console.log('🔄 Creating new general conversation for user:', currentUser.id);
            
            const { data: newConv, error: createError } = await supabase
                .from('chat_conversations')
                .insert([{
                    admin_id: null, // General conversation - no specific admin
                    user_id: currentUser.id,
                    status: 'active'
                }])
                .select()
                .single();

            if (createError) {
                console.error('❌ Error creating conversation:', createError);
                console.error('❌ Error details:', {
                    message: createError.message,
                    details: createError.details,
                    hint: createError.hint,
                    code: createError.code
                });
                
                // Provide more specific error messages
                if (createError.code === '42501') {
                    setError('Permission denied: Tidak dapat membuat percakapan. Silakan hubungi administrator.');
                } else if (createError.code === '23505') {
                    setError('Percakapan sudah ada. Mencoba memuat ulang...');
                    // Try to find the conversation again
                    return await getOrCreateConversation();
                } else {
                    setError(`Gagal membuat percakapan: ${createError.message}`);
                }
                return null;
            }

            console.log('✅ Created new general conversation:', newConv.id);
            setActiveConversation(newConv);
            return newConv;

        } catch (error) {
            console.error('❌ Error in getOrCreateConversation:', error);
            setError('Gagal mengatur percakapan');
            return null;
        }
    };

    // Fungsi untuk mendapatkan admin terakhir yang reply
    const getLastReplyingAdmin = async () => {
        if (!activeConversation) return null;

        try {
            // Ambil pesan terakhir dari admin
            const { data: lastAdminMessage, error } = await supabase
                .from('chats')
                .select(`
                    sender_id,
                    users!chats_sender_id_fkey(*)
                `)
                .eq('conversation_id', activeConversation.id)
                .not('sender_id', 'eq', currentUser?.id)
                .order('created_at', { ascending: false })
                .limit(1)
                .single();

            if (error || !lastAdminMessage) {
                console.log('No previous admin reply found');
                return null;
            }

            return null;
        } catch (error) {
            console.error('Error getting last replying admin:', error);
            return null;
        }
    };

    // Fungsi untuk mengambil pesan dari database
    const fetchMessages = async () => {
        try {
            setError(null);
            console.log('🔍 Fetching messages for conversation:', activeConversation?.id);

            if (!currentUser || !activeConversation) {
                console.log('❌ Missing required data for fetching messages');
                setMessages([]);
                setIsLoading(false);
                return;
            }

            // Ambil semua chat untuk conversation ini
            const { data: chatsData, error: chatsError } = await supabase
                .from('chats')
                .select('*')
                .eq('conversation_id', activeConversation.id)
                .order('created_at', { ascending: true });

            console.log('📨 Chat query result:', { 
                count: chatsData?.length || 0, 
                error: chatsError,
                sampleData: chatsData?.[0] 
            });

            if (chatsError) {
                console.error('❌ Error fetching chats:', chatsError);
                setError(`Failed to fetch messages: ${chatsError.message || 'Unknown error'}`);
                return;
            }

            if (!chatsData || chatsData.length === 0) {
                console.log('📭 No messages found');
                setMessages([]);
                // Still try to get last replying admin for future messages
                await getLastReplyingAdmin();
                return;
            }

            // Ambil data semua users yang terlibat sebagai sender
            const senderIds = [...new Set(chatsData.map(chat => chat.sender_id))];
            console.log('👥 Fetching users for sender IDs:', senderIds);
            
            const { data: usersData, error: usersError } = await supabase
                .from('users')
                .select('*')
                .in('id', senderIds);

            console.log('👥 Users data result:', { 
                count: usersData?.length || 0, 
                error: usersError 
            });

            if (usersError) {
                console.error('❌ Error fetching users:', usersError);
                setError(`Failed to fetch user data: ${usersError.message || 'Unknown error'}`);
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

            console.log('✅ Final messages prepared:', messagesWithUsers.length);
            setMessages(messagesWithUsers);

            // Update last replying admin
            await getLastReplyingAdmin();
            
        } catch (error) {
            console.error('❌ Error in fetchMessages:', error);
            setError('Failed to load messages');
        } finally {
            setIsLoading(false);
        }
    };

    // Fungsi untuk mengirim pesan ke admin umum
    const handleSendMessage = async () => {
        if (!inputMessage.trim() || !currentUser || !activeConversation || isSending) return;

        setIsSending(true);
        setError(null);

        try {
            console.log('📤 Sending message to general admin support:', {
                sender_id: currentUser.id,
                recipient_id: lastReplyingAdmin?.id || null, // Send to last replying admin or null for general
                admin_id: null, // General conversation
                message: inputMessage.trim(),
                conversation_id: activeConversation.id
            });

            const messageData = {
                sender_id: currentUser.id,
                recipient_id: lastReplyingAdmin?.id || null,
                admin_id: null, // General message to all admins
                message: inputMessage.trim(),
                conversation_id: activeConversation.id
            };

            const { data, error } = await supabase
                .from('chats')
                .insert([messageData])
                .select()
                .single();

            if (error) {
                console.error('❌ Error sending message:', error);
                setError(`Failed to send message: ${error.message || 'Unknown error'}`);
                return;
            }

            console.log('✅ Message sent successfully to database:', data);
            
            // Langsung tambahkan pesan ke state lokal (optimistic update)
            const newMessageWithUser: MessageWithUser = {
                ...data,
                sender: currentUser
            };

            console.log('➕ Adding message to local state:', newMessageWithUser.id);

            setMessages(prev => {
                // Cek jika pesan sudah ada (dari real-time)
                const exists = prev.some(msg => msg.id === data.id);
                if (exists) {
                    console.log('ℹ️ Message already exists in state');
                    return prev;
                }
                console.log('✨ Message added to state successfully');
                return [...prev, newMessageWithUser];
            });

            setInputMessage('');
            
        } catch (error) {
            console.error('❌ Error sending message:', error);
            setError('Failed to send message');
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

    // Setup initial data dan real-time subscription
    useEffect(() => {
        const initializeChat = async () => {
            console.log('=== Initializing general admin chat ===');
            
            // Test connection first
            const { success } = await testConnection();
            if (!success) {
                console.error('Connection test failed');
                setError('Connection failed');
                setIsLoading(false);
                return;
            }
            console.log('✅ Connection test passed');

            // Get current user
            const user = await getCurrentUser();
            if (!user) {
                console.error('Failed to get current user');
                setIsLoading(false);
                return;
            }
            console.log('✅ Current user obtained:', user.id, user.role);

            console.log('=== Chat initialization complete ===');
        };

        initializeChat();
    }, []);

    // Effect untuk setup conversation ketika currentUser sudah ready
    useEffect(() => {
        if (currentUser) {
            console.log('🔄 Setting up general conversation for user');
            getOrCreateConversation();
        }
    }, [currentUser]);

    // Effect terpisah untuk fetchMessages ketika conversation sudah ready
    useEffect(() => {
        if (currentUser && activeConversation) {
            console.log('🔄 Fetching messages because conversation is ready');
            fetchMessages();
        }
    }, [currentUser, activeConversation]);

    // Setup real-time subscription setelah conversation ready
    useEffect(() => {
        if (!currentUser || !activeConversation) return;

        console.log('Setting up real-time subscription for general conversation:', activeConversation.id);

        // Setup real-time subscription untuk pesan baru
        const channel = supabase
            .channel('user_general_chat_' + activeConversation.id)
            .on(
                'postgres_changes',
                {
                    event: 'INSERT',
                    schema: 'public',
                    table: 'chats',
                    filter: `conversation_id=eq.${activeConversation.id}`
                },
                async (payload) => {
                    console.log('Real-time: New message received:', payload);
                    
                    try {
                        const newMessage = payload.new as Message;
                        
                        console.log('Processing new message:', newMessage);
                        
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

                        // Update last replying admin if this message is from admin
                        if (userData.role === 'admin') {
                            setLastReplyingAdmin(userData);
                        }

                        // Tambahkan pesan baru ke state jika belum ada
                        setMessages(prev => {
                            const exists = prev.some(msg => msg.id === newMessage.id);
                            if (exists) {
                                console.log('Message already exists in state');
                                return prev;
                            }
                            console.log('Adding new message to state');
                            return [...prev, newMessageWithUser];
                        });

                    } catch (error) {
                        console.error('Error processing real-time message:', error);
                    }
                }
            )
            .subscribe((status) => {
                console.log('Real-time subscription status:', status);
            });

        console.log('Real-time subscription setup complete');

        // Cleanup subscription
        return () => {
            console.log('Cleaning up subscription');
            supabase.removeChannel(channel);
        };
    }, [currentUser, activeConversation]);

    // Show error state
    if (error && !isLoading) {
        return (
            <Card
                padding="p-0"
                className={clsx("flex flex-col h-full ", className)}
            >
                <div className="flex flex-row gap-4 py-3 px-5 w-full items-center border-b-2 border-b-[#E5E7EB]">
                    <h1 className="text-[#5C8D89] font-bold text-2xl">Chat dengan Admin</h1>
                </div>
                <div className="flex items-center justify-center flex-1 p-5">
                    <div className="text-center">
                        <p className="text-red-500 mb-2">{error}</p>
                        <div className="space-y-2">
                            <button 
                                onClick={() => {
                                    setError(null);
                                    if (currentUser) {
                                        getOrCreateConversation();
                                    }
                                }}
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

    // Show loading state
    if (isLoading) {
        return (
            <Card
                padding="p-0"
                className={clsx("flex flex-col h-full ", className)}
            >
                <div className="flex flex-row gap-4 py-3 px-5 w-full items-center border-b-2 border-b-[#E5E7EB]">
                    <h1 className="text-[#5C8D89] font-bold text-2xl">Chat dengan Admin</h1>
                </div>
                <div className="flex items-center justify-center flex-1">
                    <p className="text-gray-500">Memuat chat...</p>
                </div>
            </Card>
        );
    }

    return (
        <Card
            padding="p-0"
            className={clsx("flex flex-col h-full ", className)}
        >
            <div className="flex flex-row gap-4 py-3 px-5 w-full items-center border-b-2 border-b-[#E5E7EB]">
                <h1 className="text-[#5C8D89] font-bold text-2xl">
                    Chat dengan Admin
                </h1>
                {!lastReplyingAdmin && (
                    <div className="ml-auto">
                        <span className="text-sm text-gray-500">
                            Tim Support Online
                        </span>
                    </div>
                )}
            </div>
            <div className="flex flex-col flex-1 overflow-hidden ">
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

                            // Cek apakah pesan dari user yang sedang login
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
                            onClick={handleSendMessage}
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