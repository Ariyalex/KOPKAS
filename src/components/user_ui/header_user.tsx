import Image from "next/image";
import Link from "next/link";

export function HeaderUser() {
    return (
        <div className="flex items-center shadow-sm flex-row px-20 py-4 justify-between w-full h-fit z-50 top-0 bg-white">
            <div className="flex items-center gap-2 ">
                <Image src={"/logo.svg"} alt="logo" width={24} height={24} />
                <Link className="font-bold text-2xl text-[#5C8D89]" href="/">KOPKAS</Link>
            </div>
            <div className="flex felx-row gap-2 items-center justify-center">
                <Image alt="profile" src={"/dummy.jpg"} width={40} height={40}
                    className="rounded-full"
                />
                <h3 className="font-normal text-xl text-[#5C8D89] ">Vestia Zeta</h3>
            </div>
        </div>
    );
}