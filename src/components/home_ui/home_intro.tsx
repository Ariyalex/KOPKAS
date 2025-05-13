import Image from "next/image";

export function HomeIntro() {
    return (
        <div className="flex flex-row gap-20 px-20">
            <div className="flex flex-col py-8 gap-12 items-center">
                <div className="flex gap-16 flex-col">
                    <h1 className="text-[55px]/tight font-bold text-right text-[#2B2B2B]"><span className="font-black">BERANI</span>  BICARA, KAMI SIAP MENDENGAR</h1>
                    <p className="text-right text-[24px] text-[#1E390E] pl-5">kopkas adalah wadah aman untuk melaporkan kekerasan  seksual secara rahasia dan terpercaya </p>
                </div>
                <button className="rounded-full bg-[#1E390E] text-white w-fit px-5 py-3.5">
                    LAPORKAN SEKARANG
                </button>            </div>
            <Image
                alt="kopkas"
                src="/home1.png"
                width={625}
                height={625}
                className="h-auto max-h-[625px] w-auto object-contain"
            />
        </div>
    );
}