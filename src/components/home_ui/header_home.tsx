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
        <div className="flex items-center border-[#E5E7EB] border-[1px] flex-row px-20 py-4 justify-between w-full h-fit z-50 top-0 bg-white">
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
                            src={"/dummy.jpg"}
                            width={40}
                            height={40}
                            className="rounded-full object-cover w-[40px] h-[40px]"
                        />
                        <h3 className="font-normal text-xl text-[#5C8D89]">{userData.full_name}</h3>
                    </>
                )}
            </div>
        </div>
    );
}