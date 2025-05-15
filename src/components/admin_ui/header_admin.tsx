import Image from "next/image";
import Link from "next/link";
import { DummyUserContent } from "../user_ui/dummy/chat_dummy";
import { Badge, IconButton } from "rsuite";
import { Bell } from "lucide-react";

export function HeaderAdmin() {
    // Mengambil data user dari DummyUserContent
    const userData = DummyUserContent.find(admin => admin.role === "admin");

    return (
        <div className="flex items-center flex-row px-10 py-4 justify-between w-full h-fit z-50 top-0 bg-white border-b-2 border-[#E5E7EB]">
            <div className="flex items-center gap-2">
                <Image
                    src={"/logo.svg"}
                    alt="logo"
                    width={24}
                    height={24}
                    className="w-[24px] h-[24px]"
                />
                <Link className="font-bold text-2xl text-[#5C8D89]" href="/">KOPKAS</Link>
                <h3 className="text-[#6B7280]">Admin Panel</h3>
            </div>
            <div className="flex felx-row gap-2 items-center justify-center">
                {userData && (
                    <>
                        <Badge content={3} className="mr-5">
                            <button >
                                <Bell />
                            </button>
                        </Badge>
                        <Image
                            alt="profile"
                            src={userData.photo}
                            width={40}
                            height={40}
                            className="rounded-full object-cover w-[40px] h-[40px]"
                        />
                        <h3 className="font-normal text-xl text-[#5C8D89]">{userData.name}</h3>
                    </>
                )}
            </div>
        </div>
    );
}