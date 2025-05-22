import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

// import kebutuhan backend
import type { Database } from '@/lib/database.types';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

interface UserData {
    id: string;
    full_name: string | null;
    photo?: string;
}

export function HeaderUser() {
    // Mengambil data user dari Supabase
    const supabase = createClientComponentClient<Database>()
    const [userData, setUserData] = useState<UserData | null>(null)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        async function fetchUserData() {
            try {
                // Check session
                const { data: { session }, error: sessionError } = await supabase.auth.getSession()
                if (sessionError) throw sessionError
                if (!session) {
                    console.log('No session found')
                    return
                }

                // Fetch user data
                const { data: user, error: userError } = await supabase
                    .from('users')
                    .select('id, full_name, photo')
                    .eq('id', session.user.id)
                    .single()

                if (userError) {
                    console.error('Database error:', userError.message)
                    throw userError
                }

                if (!user) {
                    console.error('No user found')
                    return
                }

                setUserData(user)
            } catch (error) {
                if (error instanceof Error) {
                    setError(error.message)
                    console.error('Error detail:', error)
                }
            }
        }

        fetchUserData()
    }, [supabase])

    // Optional: Render error state
    if (error) {
        console.error('Error state:', error)
    }

    return (
        <div className="flex items-center shadow-sm flex-row px-20 py-4 justify-between w-full h-fit z-50 top-0 bg-white">
            <div className="flex items-center gap-2">
                <Image
                    src={"/logo.svg"}
                    alt="logo"
                    width={24}
                    height={24}
                    className="w-[24px] h-[24px]"
                />
                <Link className="font-bold text-2xl text-[#5C8D89]" href="/">KOPKAS</Link>
            </div>
            <div className="flex felx-row gap-2 items-center justify-center">
                {userData && (
                    <>
                        <Image
                            alt="profile"
                            src={userData.photo || '/default_photo.png'}
                            width={40}
                            height={40}
                            className="rounded-full object-cover w-[40px] h-[40px]"
                        />
                        <h3 className="font-normal text-xl text-[#5C8D89]">{userData.full_name || 'User'}</h3>
                    </>
                )}
            </div>
        </div>
    );
}