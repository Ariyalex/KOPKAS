'use client'

import { supabase } from "@/lib/supabase";
import { Session } from "@supabase/supabase-js";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

export function HeaderHome() {
    const [session, setSession] = useState<Session | null>(null);
    const [userData, setUserData] = useState<{ full_name: string } | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                // Get session
                const { data, error } = await supabase.auth.getSession();
                if (error) {
                    console.error("Error fetching session:", error);
                    return;
                }

                setSession(data.session);

                // If session exists, get user data
                if (data.session?.user?.id) {
                    const { data: userInfo, error: userError } = await supabase
                        .from('users')
                        .select('full_name')
                        .eq('id', data.session.user.id)
                        .single();

                    if (userError) {
                        console.error("Error fetching user data:", userError);
                    } else {
                        setUserData(userInfo);
                    }
                }
            } catch (e) {
                console.error("Error in authentication flow:", e);
            } finally {
                setLoading(false);
            }
        };

        fetchUserData();
    }, []);

    return (
        <div className="flex items-center flex-row px-20 py-2 justify-between w-full h-fit z-50 top-0">
            <div className="flex items-center">
                <Link className="font-bold text-[40px]" href="/">KOPKAS</Link>
            </div>
            <div>
                {loading ? (
                    <div>Loading...</div>
                ) : session ? (
                    <div className="flex items-center gap-3">
                        <Image
                            alt="profile"
                            src={'/dummy.jpg'}
                            width={40}
                            height={40}
                            className="rounded-full object-cover w-[40px] h-[40px]"
                        />
                        <h3 className="font-normal text-xl text-[#5C8D89]">{userData?.full_name}</h3>
                    </div>
                ) : (
                    <ul className="flex flex-row items-center gap-10 px-4 py-3">
                        <Link className="text-2xl" href="/register">DAFTAR</Link>
                        <Link className="bg-[#C4DADA] font-bold text-2xl px-4 py-3 border-white border-[1px]" href="/login">MASUK</Link>
                    </ul>
                )}
            </div>
        </div>
    );
}