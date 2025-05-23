import { Session } from "@supabase/supabase-js";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { FilledButton } from "../common/button";
import { ArrowRight } from "lucide-react";

interface HomeIntroProps {
    session?: Session | null;
    userData?: {
        full_name?: string;
        role?: string;
        id?: string;
        email?: string;
    } | null;
}

export function HomeIntro({ session, userData }: HomeIntroProps) {
    const router = useRouter();

    const handleButtonClick = async () => {
        if (session) {
            // Use userData passed from parent to determine redirection
            if (userData?.role === "admin") {
                router.push("/admin");
            } else if (userData?.role === "user") {
                router.push("/user");
            }
        } else {
            router.push("/login");
        }
    }

    return (
        <div className="flex flex-row gap-20 px-48 py-10 bg-[#F5FFFA]">
            <div className="flex flex-col py-8 gap-12 items-start">
                <div className="flex gap-16 flex-col">
                    <h1 className="text-5xl/tight font-bold text-left text-[#1F2937]">Berani Bicara, Kami Siap Mendengarkan</h1>
                    <p className="text-left text-lg text-[#4B5563]">KOPKAS hadir sebagai ruang aman untuk melaporkan dan mendapatkan pendampingan profesional terkait kekerasan seksual.</p>
                </div>
                <FilledButton
                    onClick={handleButtonClick}
                    bgColor="bg-[#5C8D89]"
                >
                    <div className="flex flex-row justify-center items-center gap-2">
                        <p>Laporkan Sekarang</p>
                        <ArrowRight size={16} />
                    </div>
                </FilledButton>
            </div>
            <Image
                alt="kopkas"
                src="/welcome.png"
                width={625}
                height={625}
                className="h-auto max-h-[594px] w-auto object-contain"
            />
        </div>
    );
}