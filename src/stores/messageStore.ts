import type { Database } from '@/lib/database.types';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { create } from 'zustand';
import type { Message } from '../types';

interface MessageState {
  messages: Message[];
  unreadCount: number;
  isLoading: boolean;
  error: string | null;
  
  // Actions
  fetchMessages: (userId?: string) => Promise<void>;
  sendMessage: (content: string, recipientId: string) => Promise<void>;
  markAsRead: (messageId: string) => Promise<void>;
  clearError: () => void;
}

export const useMessageStore = create<MessageState>((set, get) => ({
  messages: [],
  unreadCount: 0,
  isLoading: false,
  error: null,

  fetchMessages: async (userId?: string) => {
    set({ isLoading: true });
    try {
      const supabase = createClientComponentClient<Database>();
      
      let query = supabase
        .from('chats')
        .select(`
          id,
          message,
          created_at,
          sender:users!chats_sender_id_fkey (
            id,
            full_name
          )
        `)
        .order('created_at', { ascending: false });

      if (userId) {
        query = query.or(`sender_id.eq.${userId},recipient_id.eq.${userId}`);
      }

      const { data, error } = await query;

      if (error) throw error;

      set({ messages: data as unknown as Message[], error: null });

    } catch (error: any) {
      set({ error: error.message });
    } finally {
      set({ isLoading: false });
    }
  },

  sendMessage: async (content: string, recipientId: string) => {
    try {
      const supabase = createClientComponentClient<Database>();
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) throw new Error('No session found');

      const { error } = await supabase
        .from('chats')
        .insert({
          message: content,
          sender_id: session.user.id,
          recipient_id: recipientId
        });

      if (error) throw error;

      // Refresh messages
      get().fetchMessages();

    } catch (error: any) {
      set({ error: error.message });
    }
  },

  markAsRead: async (messageId: string) => {
    try {
      const supabase = createClientComponentClient<Database>();
      
      const { error } = await supabase
        .from('chats')
        .update({ is_read: true })
        .eq('id', messageId);

      if (error) throw error;

    } catch (error: any) {
      set({ error: error.message });
    }
  },

  clearError: () => set({ error: null })
}));
