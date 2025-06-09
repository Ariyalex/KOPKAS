import { useUserStore } from '@/stores/userStore';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

/**
 * Handles user logout by:
 * 1. Signing out from Supabase
 * 2. Clearing all related localStorage data
 * 3. Clearing the userStore state
 */
export const handleLogout = async () => {
    try {
        // Create a fresh client instance for logout
        const supabaseClient = createClientComponentClient();

        // Proceed with logout
        const { error } = await supabaseClient.auth.signOut({ scope: 'local' });

        if (error) {
            console.error("Logout error:", error.message);
        }

        // Clear all local storage items
        if (typeof window !== 'undefined') {
            // Clear all Supabase-related items
            const keysToRemove = [];

            // Find all Supabase-related keys
            for (let i = 0; i < localStorage.length; i++) {
                const key = localStorage.key(i);
                if (key && (
                    key.startsWith('supabase.') ||
                    key.includes('auth') ||
                    key.includes('token') ||
                    key.includes('session')
                )) {
                    keysToRemove.push(key);
                }
            }

            // Remove found keys
            keysToRemove.forEach(key => {
                localStorage.removeItem(key);
            });

            // Clear other app-specific data
            localStorage.removeItem('kopkas_user_preferences');
            localStorage.removeItem('kopkas_admin_preferences');
            localStorage.removeItem('kopkas_recent_reports');
            localStorage.removeItem('kopkas_filters');

            console.log('All local storage data cleared');
        }

        // Clear the userStore state
        const userStore = useUserStore.getState();
        userStore.clearUser();

        console.log('User data cleared from store');
    } catch (error: any) {
        console.error("Logout failed:", error.message);
    }
};