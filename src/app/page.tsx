'use client'

import { FeatureKopkas } from "@/components/home_ui/feature_home";
import { HeaderHome } from "../components/home_ui/header_home";
import { HomeIntro } from "../components/home_ui/home_intro";
import { PsikologKopkas } from "@/components/home_ui/psikolog_home";
import { Footer } from "@/components/home_ui/footer";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Session } from "@supabase/supabase-js";
import { Loading } from "@/components/common/loading";

export default function Home() {
  const [isLoading, setIsLoading] = useState(true);
  const [session, setSession] = useState<Session | null>(null);
  const [userData, setUserData] = useState<{
    full_name?: string;
    role?: string;
    id?: string;
    email?: string;
  } | null>(null);

  useEffect(() => {
    const checkSession = async () => {
      try {
        // Simulate a minimal delay to prevent flickering
        await new Promise(resolve => setTimeout(resolve, 300));

        // Check for session
        const { data, error } = await supabase.auth.getSession();
        if (error) {
          console.error("Error checking session:", error);
          setIsLoading(false);
          return;
        }

        setSession(data.session);

        // If session exists, get user data
        if (data.session?.user?.id) {
          const { data: userInfo, error: userError } = await supabase
            .from('users')
            .select('full_name, role, id, email')
            .eq('id', data.session.user.id)
            .single();

          if (userError) {
            console.error("Error fetching user data:", userError);
          } else {
            setUserData(userInfo);
          }
        }
      } catch (error) {
        console.error("Session check failed:", error);
      } finally {
        setIsLoading(false);
      }
    };

    checkSession();
  }, []);


  if (isLoading) {
    return <Loading text="Loading..." fullScreen={true} />;
  }

  return (
    <main className="">
      <HeaderHome userData={userData} />
      <div className="p-0">
        <HomeIntro session={session} userData={userData} />
        <FeatureKopkas />
        <PsikologKopkas />
      </div>
      <Footer />
    </main>
  );
}
