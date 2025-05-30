import type { Database } from '@/lib/database.types';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { create } from 'zustand';
import type { UserData } from '../types';

interface UserState {
  currentUser: UserData | null;
  isLoading: boolean;
  error: string | null;

// Actions
  fetchCurrentUser: () => Promise<void>;
  updateUserName: (newName: string) => Promise<void>;
  updateUserPhoto: (file: File) => Promise<void>;
  clearError: () => void;
}

export const useUserStore = create<UserState>((set, get) => ({
  currentUser: null,
  isLoading: false,
  error: null,

  fetchCurrentUser: async () => {
    set({ isLoading: true });
    try {
      const supabase = createClientComponentClient<Database>();
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) throw new Error('No session found');

      const { data: userData, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', session.user.id)
        .single();

      if (error) throw error;

      set({ currentUser: userData, error: null });

    } catch (error: any) {
      set({ error: error.message });
    } finally {
      set({ isLoading: false });
    }
  },

  updateUserName: async (newName: string) => {
    set({ isLoading: true });
    try {
      const supabase = createClientComponentClient<Database>();
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) throw new Error('No session found');

      const { error } = await supabase
        .from('users')
        .update({ full_name: newName })
        .eq('id', session.user.id);

      if (error) throw error;

      const { currentUser } = get();
      if (currentUser) {
        set({ 
          currentUser: { ...currentUser, full_name: newName },
          error: null 
        });
      }

    } catch (error: any) {
      set({ error: error.message });
    } finally {
      set({ isLoading: false });
    }
  },

  updateUserPhoto: async (file: File) => {
    set({ isLoading: true });
    try {
      const supabase = createClientComponentClient<Database>();
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) throw new Error('No session found');

      // Validate file
      if (file.size > 2 * 1024 * 1024) {
        throw new Error('File size too large (max 2MB)');
      }
      
      if (!file.type.startsWith('image/')) {
        throw new Error('File must be an image');
      }

      const { currentUser } = get();

      // Delete old photo if exists
      if (currentUser?.photo) {
        const oldPath = currentUser.photo.split('/').pop();
        if (oldPath) {
          await supabase.storage
            .from('avatars')
            .remove([`${session.user.id}/${oldPath}`]);
        }
      }

      // Upload new photo
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}.${fileExt}`;
      const filePath = `${session.user.id}/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: true
        });

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath);

      // Update user profile
      const { error: updateError } = await supabase
        .from('users')
        .update({ photo: publicUrl })
        .eq('id', session.user.id);

      if (updateError) throw updateError;

      if (currentUser) {
        set({ 
          currentUser: { ...currentUser, photo: publicUrl },
          error: null 
        });
      }

    } catch (error: any) {
      set({ error: error.message });
    } finally {
      set({ isLoading: false });
    }
  },

  clearError: () => set({ error: null })
}));
