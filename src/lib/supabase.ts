import { createClient } from '@supabase/supabase-js'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

// Untuk Next.js client component
export const supabase = createClientComponentClient()

// Alternatif: Client dengan local storage untuk debugging
export const supabaseLocal = createClient(supabaseUrl, supabaseKey, {
    auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
        storage: {
            getItem: (key) => {
                if (typeof window !== 'undefined') {
                    return window.localStorage.getItem(key);
                }
                return null;
            },
            setItem: (key, value) => {
                if (typeof window !== 'undefined') {
                    window.localStorage.setItem(key, value);
                }
            },
            removeItem: (key) => {
                if (typeof window !== 'undefined') {
                    window.localStorage.removeItem(key);
                }
            }
        }
    }
})