import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { create } from 'zustand';

interface Message {
    id: string;
    sender_id: string;
    recipient_id: string | null;
    admin_id: string | null;
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
    admin_id: string | null;
    user_id: string;
    created_at: string;
    status?: string;
    last_admin_reply_id?: string | null;
}

interface ChatUserState {
    // States
    currentUser: User | null;
    activeConversation: Conversation | null;
    lastReplyingAdmin: User | null;
    messages: MessageWithUser[];
    inputMessage: string;
    isLoading: boolean;
    isSending: boolean;
    error: string | null;
    
    // Actions
    setInputMessage: (message: string) => void;
    initializeChat: () => Promise<void>;
    sendMessage: () => Promise<void>;
    setupRealTimeSubscription: () => () => void;
    clearError: () => void;
    reset: () => void;
}

const supabase = createClientComponentClient();

export const useChatUserStore = create<ChatUserState>((set, get) => ({
    // Initial States
    currentUser: null,
    activeConversation: null,
    lastReplyingAdmin: null,
    messages: [],
    inputMessage: '',
    isLoading: true,
    isSending: false,
    error: null,

    // Actions
    setInputMessage: (message) => set({ inputMessage: message }),

    initializeChat: async () => {
        try {
            console.log('=== Initializing general admin chat ===');
            set({ isLoading: true, error: null });

            // Test connection
            const connectionTest = await testConnection();
            if (!connectionTest.success) {
                console.error('Connection test failed');
                set({ error: 'Connection failed', isLoading: false });
                return;
            }
            console.log('✅ Connection test passed');

            // Get current user
            const user = await getCurrentUser();
            if (!user) {
                console.error('Failed to get current user');
                set({ isLoading: false });
                return;
            }
            console.log('✅ Current user obtained:', user.id, user.role);

            // ✅ TAMBAHKAN INI: Set loading false setelah user berhasil didapat
            set({ isLoading: false });
            
            console.log('=== Chat initialization complete ===');
        } catch (error) {
            console.error('Error initializing chat:', error);
            set({ error: 'Gagal menginisialisasi chat', isLoading: false });
        }
    },

    sendMessage: async () => {
        const state = get();
        const { inputMessage, currentUser, activeConversation, lastReplyingAdmin, isSending } = state;

        if (!inputMessage.trim() || !currentUser || !activeConversation || isSending) return;

        try {
            set({ isSending: true, error: null });

            console.log('📤 Sending message to general admin support');

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
                set({ error: `Failed to send message: ${error.message}`, isSending: false });
                return;
            }

            console.log('✅ Message sent successfully:', data.id);
            
            // Optimistic update
            const newMessageWithUser: MessageWithUser = {
                ...data,
                sender: currentUser
            };

            set((state) => ({
                messages: [...state.messages, newMessageWithUser],
                inputMessage: '',
                isSending: false
            }));
            
        } catch (error) {
            console.error('❌ Error sending message:', error);
            set({ error: 'Failed to send message', isSending: false });
        }
    },

    setupRealTimeSubscription: () => {
        const state = get();
        const { currentUser, activeConversation } = state;

        if (!currentUser || !activeConversation) return () => {};

        console.log('🔔 Setting up real-time subscription for general conversation:', activeConversation.id);

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
                    console.log('📨 Real-time: New message received:', payload);
                    
                    try {
                        const newMessage = payload.new as Message;
                        
                        // Fetch user data for new message
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
                            set({ lastReplyingAdmin: userData });
                        }

                        // Add message to state if not exists
                        set((state) => {
                            const exists = state.messages.some(msg => msg.id === newMessage.id);
                            if (exists) {
                                console.log('Message already exists in state');
                                return state;
                            }
                            console.log('Adding new message to state');
                            return {
                                ...state,
                                messages: [...state.messages, newMessageWithUser]
                            };
                        });

                    } catch (error) {
                        console.error('Error processing real-time message:', error);
                    }
                }
            )
            .subscribe((status) => {
                console.log('🔔 Real-time subscription status:', status);
            });

        return () => {
            console.log('🔇 Cleaning up subscription');
            supabase.removeChannel(channel);
        };
    },

    clearError: () => set({ error: null }),

    reset: () => set({
        activeConversation: null,
        lastReplyingAdmin: null,
        messages: [],
        inputMessage: '',
        isLoading: true,
        isSending: false,
        error: null
    })
}));

// Helper functions
async function testConnection() {
    try {
        console.log('Testing Supabase connection...');
        
        const { data: testData, error: testError } = await supabase
            .from('users')
            .select('count')
            .limit(1);
            
        console.log('Connection test:', { testData, testError });
        
        const { data: { user: authUser }, error: authError } = await supabase.auth.getUser();
        console.log('Auth test:', { authUser, authError });
        
        return { success: !testError && !authError, authUser };
    } catch (error) {
        console.error('Connection test failed:', error);
        return { success: false, authUser: null };
    }
}

async function getCurrentUser() {
    try {
        const { data: { user: authUser }, error: authError } = await supabase.auth.getUser();
        
        console.log('Getting current user:', { authUser, authError });
        
        if (authError) {
            console.error('Auth error:', authError);
            useChatUserStore.setState({ error: 'Authentication error' });
            return null;
        }
        
        if (!authUser) {
            useChatUserStore.setState({ error: 'User not authenticated' });
            return null;
        }

        // Try to get user data from users table
        const { data: userData, error: userError } = await supabase
            .from('users')
            .select('*')
            .eq('id', authUser.id)
            .single();

        console.log('User data from users table:', { userData, userError });

        if (userError) {
            console.error('Error fetching user data:', userError);
            // If user doesn't exist in users table, create new user
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
                useChatUserStore.setState({ error: 'Failed to create user profile' });
                return null;
            }

            useChatUserStore.setState({ currentUser: insertedUser });
            return insertedUser;
        }

        useChatUserStore.setState({ currentUser: userData });
        return userData;
    } catch (error) {
        console.error('Error getting current user:', error);
        useChatUserStore.setState({ error: 'Failed to get user data' });
        return null;
    }
}

// Export function to setup conversation (to be called from component)
export async function setupConversation() {
    const state = useChatUserStore.getState();
    const { currentUser } = state;
    
    if (!currentUser) {
        console.log('❌ Missing currentUser');
        useChatUserStore.setState({ isLoading: false });
        return;
    }

    try {
        console.log('🔄 Setting up general conversation for user');
        
        const conversation = await getOrCreateConversation(currentUser);
        if (conversation) {
            // ✅ Set loading false setelah conversation setup
            useChatUserStore.setState({ isLoading: false });
        }
    } catch (error) {
        console.error('Error setting up conversation:', error);
        useChatUserStore.setState({ error: 'Gagal mengatur percakapan', isLoading: false });
    }
}

async function getOrCreateConversation(currentUser: User) {
    try {
        console.log('🔍 Looking for existing general conversation for user:', currentUser.id);

        // Find general user conversation (admin_id = NULL)
        const { data: existingConv, error: findError } = await supabase
            .from('chat_conversations')
            .select('*')
            .eq('user_id', currentUser.id)
            .is('admin_id', null)
            .maybeSingle();

        console.log('🔍 Find conversation result:', { existingConv, findError });

        if (findError) {
            console.error('❌ Error finding conversation:', findError);
            useChatUserStore.setState({ error: `Error mencari percakapan: ${findError.message}` });
            return null;
        }

        if (existingConv) {
            console.log('✅ Found existing general conversation:', existingConv.id);
            useChatUserStore.setState({ activeConversation: existingConv });
            return existingConv;
        }

        // If not exists, create new general conversation
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
            
            // Provide specific error messages
            if (createError.code === '42501') {
                useChatUserStore.setState({ error: 'Permission denied: Tidak dapat membuat percakapan. Silakan hubungi administrator.' });
            } else if (createError.code === '23505') {
                useChatUserStore.setState({ error: 'Percakapan sudah ada. Mencoba memuat ulang...' });
                // Try to find the conversation again
                return await getOrCreateConversation(currentUser);
            } else {
                useChatUserStore.setState({ error: `Gagal membuat percakapan: ${createError.message}` });
            }
            return null;
        }

        console.log('✅ Created new general conversation:', newConv.id);
        useChatUserStore.setState({ activeConversation: newConv });
        return newConv;

    } catch (error) {
        console.error('❌ Error in getOrCreateConversation:', error);
        useChatUserStore.setState({ error: 'Gagal mengatur percakapan' });
        return null;
    }
}

// Export function to fetch messages (to be called from component)
export async function fetchMessages() {
    const state = useChatUserStore.getState();
    const { currentUser, activeConversation } = state;

    try {
        useChatUserStore.setState({ error: null });
        console.log('🔍 Fetching messages for conversation:', activeConversation?.id);

        if (!currentUser || !activeConversation) {
            console.log('❌ Missing required data for fetching messages');
            useChatUserStore.setState({ messages: [], isLoading: false });
            return;
        }

        // Get all chats for this conversation
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
            useChatUserStore.setState({ error: `Failed to fetch messages: ${chatsError.message}`, isLoading: false });
            return;
        }

        if (!chatsData || chatsData.length === 0) {
            console.log('📭 No messages found');
            useChatUserStore.setState({ messages: [], isLoading: false });
            await getLastReplyingAdmin();
            return;
        }

        // Get data for all users involved as senders
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
            useChatUserStore.setState({ error: `Failed to fetch user data: ${usersError.message}`, isLoading: false });
            return;
        }

        // Combine chat data with user sender
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
        // ✅ Set loading false setelah messages berhasil dimuat
        useChatUserStore.setState({ messages: messagesWithUsers, isLoading: false });

        // Update last replying admin
        await getLastReplyingAdmin();
        
    } catch (error) {
        console.error('❌ Error in fetchMessages:', error);
        useChatUserStore.setState({ error: 'Failed to load messages', isLoading: false });
    }
}

async function getLastReplyingAdmin() {
    const state = useChatUserStore.getState();
    const { activeConversation, currentUser } = state;
    
    if (!activeConversation) return null;

    try {
        // Get last message from admin
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

        // const adminUser = lastAdminMessage.users;
        // if (adminUser && adminUser.role === 'admin') {
        //     useChatUserStore.setState({ lastReplyingAdmin: adminUser });
        //     return adminUser;
        // }

        return null;
    } catch (error) {
        console.error('Error getting last replying admin:', error);
        return null;
    }
}

