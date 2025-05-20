import { Mail, Phone } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export function Footer() {
    return (
        <footer
            className="flex flex-col w-full py-12 gap-8 px-20 bg-white"
        >
            <div className="flex flex-row gap-8">
                <div className="flex flex-col gap-6 flex-1">
                    <div className="flex items-center gap-2">
                        <Image
                            src={"/logo.svg"}
                            alt="logo"
                            width={24}
                            height={24}
                            className="w-[24px] h-[24px]"
                        />
                        <h4 className="font-bold text-2xl text-[#5C8D89]">KOPKAS</h4>
                    </div>
                    <p className="text-[#4B5563]">Platform pelaporan dan pendampingan korban kekerasan seksual yang aman dan terpercaya.</p>
                </div>
                <div className="flex flex-2 flex-col gap-4">
                    <h4 className="text-lg font-bold">kontak</h4>
                    <div className="flex flex-col gap-2">
                        <div className="flex flex-row gap-2">
                            <Phone color="#3CB371" />
                            <p className="text-[#4B5563]">0800-1234-5678</p>
                        </div>
                        <div className="flex flex-row gap-2">
                            <Mail color="#3CB371" />
                            <p className="text-[#4B5563]">help@kopkas.org</p>
                        </div>
                    </div>
                </div>
                <div className="flex flex-2 flex-col gap-4">
                    <h4 className="text-lg font-bold">Media Sosial</h4>
                    <div className="flex flex-row gap-2">
                        <Link
                            href={""}
                            className="flex justify-center items-center p-3 rounded-full w-10 h-10 bg-[#5C8D89] ">
                            <Image
                                src={"/svg/facebook.svg"}
                                alt="facebook"
                                width={20} height={20}
                                className="w-3"
                            />
                        </Link>
                        <Link
                            href={""}
                            className="flex justify-center items-center p-3 rounded-full w-10 h-10 bg-[#5C8D89] ">
                            <Image
                                src={"/svg/twitter.svg"}
                                alt="twitter"
                                width={20} height={20}
                                className="w-4"
                            />
                        </Link>
                        <Link
                            href={""}
                            className="flex justify-center items-center p-3 rounded-full w-10 h-10 bg-[#5C8D89] ">
                            <Image
                                src={"/svg/instagram.svg"}
                                alt="instagram"
                                width={20} height={20}
                                className="w-3.5"
                            />
                        </Link>
                    </div>
                </div>
            </div>
            <div className="flex justify-center items-center pt-8 border-t-[1px] border-[#E5E7EB]">
                <p>© 2025 KOPKAS. Hak Cipta Dilindungi.</p>
            </div>
        </footer>
    )
}