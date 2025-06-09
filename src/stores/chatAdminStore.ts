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

interface ChatAdminState {
    // States
    currentUser: User | null;
    targetUser: User | null;
    activeConversation: Conversation | null;
    messages: MessageWithUser[];
    inputMessage: string;
    isLoadingAdmin: boolean;
    isLoadingChat: boolean;
    isSending: boolean;
    error: string | null;
    activeChatId: string | null;
    
    // Actions
    setActiveChatId: (chatId: string | null) => void;
    setInputMessage: (message: string) => void;
    initializeAdmin: () => Promise<void>;
    loadChatData: (chatId: string) => Promise<void>;
    sendMessage: () => Promise<void>;
    setupRealTimeSubscription: () => () => void;
    clearError: () => void;
    reset: () => void;
}

// Helper function to validate UUID
const isValidUUID = (str: string): boolean => {
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    return uuidRegex.test(str);
};

const supabase = createClientComponentClient();

export const useChatAdminStore = create<ChatAdminState>((set, get) => ({
    // Initial States
    currentUser: null,
    targetUser: null,
    activeConversation: null,
    messages: [],
    inputMessage: '',
    isLoadingAdmin: true,
    isLoadingChat: false,
    isSending: false,
    error: null,
    activeChatId: null,

    // Actions
    setActiveChatId: (chatId) => {
        const state = get();
        
        // Reset states when chatId changes
        set({
            activeChatId: chatId,
            targetUser: null,
            activeConversation: null,
            messages: [],
            error: null,
            isLoadingChat: false
        });

        // Load chat data if valid chatId and admin ready
        if (chatId && chatId.trim() !== '' && isValidUUID(chatId) && state.currentUser) {
            state.loadChatData(chatId);
        }
    },

    setInputMessage: (message) => set({ inputMessage: message }),

    initializeAdmin: async () => {
        try {
            console.log('🔧 Initializing admin authentication...');
            set({ isLoadingAdmin: true, error: null });

            const { data: { user: authUser }, error: authError } = await supabase.auth.getUser();
            
            if (authError || !authUser) {
                set({ error: 'Admin tidak terautentikasi', isLoadingAdmin: false });
                return;
            }

            const { data: userData, error: userError } = await supabase
                .from('users')
                .select('*')
                .eq('id', authUser.id)
                .single();

            if (userError || !userData) {
                set({ error: 'Data admin tidak ditemukan', isLoadingAdmin: false });
                return;
            }

            if (userData.role !== 'admin') {
                set({ error: 'Akses ditolak: Hanya admin yang bisa menggunakan fitur ini', isLoadingAdmin: false });
                return;
            }

            console.log('✅ Admin authenticated:', userData.email);
            set({ currentUser: userData, isLoadingAdmin: false });
        } catch (error) {
            console.error('Error initializing admin:', error);
            set({ error: 'Gagal mengambil data admin', isLoadingAdmin: false });
        }
    },

    loadChatData: async (chatId: string) => {
        try {
            console.log('🚀 Loading chat data for conversation:', chatId);
            set({ isLoadingChat: true, error: null });

            // Get conversation
            const conversation = await getConversationById(chatId);
            if (!conversation) {
                set({ isLoadingChat: false });
                return;
            }

            // Get target user
            const user = await getTargetUser(conversation);
            if (!user) {
                set({ isLoadingChat: false });
                return;
            }

            console.log('✅ Chat data loaded successfully');
            set({ isLoadingChat: false });

            // Fetch messages will be triggered by useEffect in component
        } catch (error) {
            console.error('Error loading chat data:', error);
            set({ error: 'Gagal memuat data chat', isLoadingChat: false });
        }
    },

    sendMessage: async () => {
        const state = get();
        const { inputMessage, currentUser, targetUser, activeConversation, isSending } = state;

        if (!inputMessage.trim() || !currentUser || !targetUser || !activeConversation || isSending) return;

        try {
            set({ isSending: true });

            console.log('📤 Admin sending message to general conversation');

            const messageData = {
                sender_id: currentUser.id,
                recipient_id: targetUser.id,
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
                set({ error: `Gagal mengirim pesan: ${error.message}`, isSending: false });
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
            console.error('Error sending message:', error);
            set({ error: 'Gagal mengirim pesan', isSending: false });
        }
    },

    setupRealTimeSubscription: () => {
        const state = get();
        const { currentUser, activeConversation } = state;

        if (!currentUser || !activeConversation) {
            console.log('💤 No real-time subscription - missing requirements');
            return () => {};
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

                    set((state) => {
                        const exists = state.messages.some(msg => msg.id === newMessage.id);
                        if (exists) return state;
                        
                        return {
                            ...state,
                            messages: [...state.messages, newMessageWithUser]
                        };
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
    },

    clearError: () => set({ error: null }),

    reset: () => set({
        targetUser: null,
        activeConversation: null,
        messages: [],
        inputMessage: '',
        isLoadingChat: false,
        isSending: false,
        error: null,
        activeChatId: null
    })
}));

// Helper functions
async function getConversationById(conversationId: string) {
    try {
        console.log('🔍 Getting conversation by ID:', conversationId);

        const { data: conversation, error } = await supabase
            .from('chat_conversations')
            .select('*')
            .eq('id', conversationId)
            .single();

        if (error) {
            console.error('Error getting conversation:', error);
            useChatAdminStore.setState({ error: 'Percakapan tidak ditemukan' });
            return null;
        }

        console.log('✅ Found conversation:', conversation);
        useChatAdminStore.setState({ activeConversation: conversation });
        return conversation;
    } catch (error) {
        console.error('Error in getConversationById:', error);
        useChatAdminStore.setState({ error: 'Gagal mengambil data percakapan' });
        return null;
    }
}

async function getTargetUser(conversation: Conversation) {
    try {
        console.log('🔍 Getting target user:', conversation.user_id);

        const { data: userData, error: userError } = await supabase
            .from('users')
            .select('*')
            .eq('id', conversation.user_id)
            .single();

        if (userError || !userData) {
            console.error('Target user not found:', userError);
            useChatAdminStore.setState({ error: 'User tidak ditemukan' });
            return null;
        }

        console.log('✅ Found target user:', userData.full_name);
        useChatAdminStore.setState({ targetUser: userData });
        return userData;
    } catch (error) {
        console.error('Error getting target user:', error);
        useChatAdminStore.setState({ error: 'Gagal mengambil data user' });
        return null;
    }
}

// Export function to fetch messages (to be called from component)
export async function fetchMessages() {
    const state = useChatAdminStore.getState();
    const { currentUser, activeConversation } = state;

    if (!currentUser || !activeConversation) {
        useChatAdminStore.setState({ messages: [] });
        return;
    }

    try {
        console.log('📨 Fetching messages for conversation:', activeConversation.id);

        const { data: chatsData, error: chatsError } = await supabase
            .from('chats')
            .select('*')
            .eq('conversation_id', activeConversation.id)
            .order('created_at', { ascending: true });

        if (chatsError) {
            console.error('Error fetching chats:', chatsError);
            useChatAdminStore.setState({ error: `Gagal mengambil pesan: ${chatsError.message}` });
            return;
        }

        if (!chatsData || chatsData.length === 0) {
            console.log('📭 No messages found');
            useChatAdminStore.setState({ messages: [] });
            return;
        }

        // Get user data for all senders
        const senderIds = [...new Set(chatsData.map(chat => chat.sender_id))];
        
        const { data: usersData, error: usersError } = await supabase
            .from('users')
            .select('*')
            .in('id', senderIds);

        if (usersError) {
            console.error('Error fetching users:', usersError);
            useChatAdminStore.setState({ error: `Gagal mengambil data user: ${usersError.message}` });
            return;
        }

        // Combine chat data with user data
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
        useChatAdminStore.setState({ messages: messagesWithUsers });

    } catch (error) {
        console.error('Error in fetchMessages:', error);
        useChatAdminStore.setState({ error: 'Gagal memuat pesan' });
    }
}