'use client'

import { Loading } from "@/components/common/loading";
import { FeatureKopkas } from "@/components/home_ui/feature_home";
import { Footer } from "@/components/home_ui/footer";
import { PsikologKopkas } from "@/components/home_ui/psikolog_home";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { Session } from "@supabase/supabase-js";
import { useEffect, useState } from "react";
import { HeaderHome } from "../components/home_ui/header_home";
import { HomeIntro } from "../components/home_ui/home_intro";
import { useUserStore } from "@/stores/userStore";

export default function Home() {
  const [session, setSession] = useState<Session | null>(null);
  const { currentUser, isLoading: userLoading, fetchCurrentUser } = useUserStore();
  const [isLoading, setIsLoading] = useState(true);

  // Session check and user data fetch
  useEffect(() => {
    const checkSession = async () => {
      try {
        // Simulate a minimal delay to prevent flickering
        await new Promise(resolve => setTimeout(resolve, 300));

        // Check for session using Supabase client
        const supabase = createClientComponentClient();
        const { data, error } = await supabase.auth.getSession();

        if (error) {
          console.error("Error checking session:", error);
          setIsLoading(false);
          return;
        }

        setSession(data.session);

        // If session exists, fetch user data from store
        if (data.session?.user?.id) {
          await fetchCurrentUser();
        }
      } catch (error) {
        console.error("Session check failed:", error);
      } finally {
        setIsLoading(false);  // Make sure loading is set to false
      }
    };

    checkSession();
  }, [fetchCurrentUser]);
  // Show loading state
  if (isLoading || userLoading) {
    return <Loading text="Loading..." fullScreen={true} />;
  }

  return (
    <main className="flex flex-col h-full">
      <HeaderHome userData={currentUser} />
      <div className="p-0">
        <HomeIntro session={session} userData={currentUser} />
        <FeatureKopkas />
        <PsikologKopkas />
      </div>
      <Footer />
    </main>
  );
}
