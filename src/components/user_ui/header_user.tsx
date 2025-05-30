import Image from "next/image";
import Link from "next/link";
import { useUserStore } from "@/stores/userStore";



export function HeaderUser() {
    const { currentUser } = useUserStore();

    return (
        <div className="flex items-center shadow-sm flex-row px-20 py-4 justify-between w-full h-fit z-50 top-0 bg-white">
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
                {currentUser && (
                    <>
                        <Image
                            alt="profile"
                            src={currentUser.photo || '/default_photo.png'}
                            width={40}
                            height={40}
                            className="rounded-full object-cover w-[40px] h-[40px]"
                        />
                        <h3 className="font-normal text-xl text-[#5C8D89]">{currentUser.full_name || 'User'}</h3>
                    </>
                )}
            </div>
        </div>
    );
}