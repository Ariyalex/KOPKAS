import { HeartPulse, Shield, ShieldHalf } from "lucide-react";
import { Card } from "../common/card";
import Image from "next/image";
import { ButtonGesture, CardGesture } from "../animation/transition";

interface FeatureItem {
    title: string;
    icon: string;
    content: string;
}

//nav item
const featureContent: FeatureItem[] = [
    {
        title: "Pelaporan Anonim",
        icon: "/svg/anonim.svg",
        //routing ditaruh di content
        content: "Laporkan kejadian dengan identitas terlindungi. Kerahasiaan Anda adalah priotitas kami."
    },
    {
        title: "Pendampingan Psikologis",
        icon: "/svg/heart_pulse.svg",
        content: "Konsultasi dengan psikolog profesional untuk mendapatkan dukungan emosional."
    },
    {
        title: "Keamanan Data",
        icon: "/svg/shield.svg",
        content: "Data anda dilindungi dengan aman dan amanah."
    },


]

export function FeatureKopkas() {
    return (
        <div className="flex flex-col justify-center items-center gap-11 px-48 py-16 bg-white">
            <h2 className="text-[#1F2937] font-bold text-3xl">Fitur Utama Kopkas</h2>
            <div className="flex flex-row gap-8">
                {featureContent.map(({ title, icon, content }, index) => (
                    <CardGesture key={index}
                        clasName="flex flex-col flex-1"
                    >
                        <Card
                            bgColor="bg-[#E6FFFA]"
                            shadow="shadow-xs"
                            className="flex flex-col flex-1 gap-6"
                        >
                            <div className="flex p-5 w-16 h-16 rounded-full bg-[#5C8D89]">
                                <Image
                                    src={icon}
                                    color="white"
                                    alt={title}
                                    width={25} height={25}
                                    className="w-6 h-[21px] text-white"
                                />
                            </div>
                            <h3
                                className="text-[#1F2937] font-bold text-xl"
                            >{title}</h3>
                            <p className="text-[#4B5563]">{content}</p>
                        </Card>
                    </CardGesture>
                ))}
            </div>
        </div>
    );
}