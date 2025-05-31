import { HeartPulse, Shield, ShieldHalf } from "lucide-react";
import { Card } from "../common/card";
import Image from "next/image";
import { CardGesture } from "../animation/transition";

interface PsikologItem {
    title: string;
    icon: string;
    content: string;
}

//nav item
const psikologContent: PsikologItem[] = [
    {
        title: "Dr. Zeta",
        icon: "/dummy.jpg",
        //routing ditaruh di content
        content: "Psikolog Klinis"
    },
    {
        title: "Dr. Altria",
        icon: "/dummy1.webp",
        content: "Psikolog Trauma"
    },
    {
        title: "Dr. Artoria",
        icon: "/dummy2.jpg",
        content: "Psikolog Forensik"
    },


]

export function PsikologKopkas() {
    return (
        <div className="flex flex-col justify-center items-center gap-11 sm:px-48 px-5 py-16 bg-[#F5FFFA]">
            <h2 className="text-[#1F2937] font-bold sm:text-start text-center text-3xl">Tim Pendamping Profesional</h2>
            <div className="flex sm:flex-row flex-col gap-8">
                {psikologContent.map(({ title, icon, content }, index) => (
                    <CardGesture key={index}
                        clasName="flex flex-1"
                    >
                        <Card key={index}
                            shadow="shadow-xs"
                            width="w-[300px]"
                            className="flex flex-col sm:w-[350px] justify-center items-center gap-4"
                        >
                            <Image
                                src={icon}
                                color="white"
                                alt={title}
                                width={100} height={100}
                                className="w-24 h-24 rounded-full object-cover text-white"
                            />
                            <h3
                                className="text-[#1F2937] font-bold text-xl"
                            >{title}</h3>
                            <p className="text-[#4B5563] text-center">{content}</p>
                        </Card>
                    </CardGesture>
                ))}
            </div>
        </div>
    );
}