'use client'

import Image from "next/image";
import Link from "next/link";
import { ButtonGesture } from "../animation/transition";

interface HeaderHomeProps {
    userData?: {
        full_name?: string;
        role?: string;
        id?: string;
        email?: string;
    } | null;
}

export function HeaderHome({ userData }: HeaderHomeProps) {

    return (
        <div className="flex items-center border-[#E5E7EB] border-[1px] flex-row sm:px-20 px-3 py-4 justify-between w-full h-fit z-50 top-0 bg-white">
            <div className="flex items-center gap-2">
                <Image
                    src={"/logo.svg"}
                    alt="logo"
                    width={24}
                    height={24}
                    className="w-[24px] h-[24px]"
                />
                <Link className="font-bold sm:text-2xl text-xl text-[#5C8D89]" href="/">KOPKAS</Link>
            </div>
            <div className="flex felx-row gap-2 items-center justify-center">
                {userData ? (
                    <div className="flex flex-row gap-2 justify-center items-center">
                        <Image
                            alt="profile"
                            src={"/dummy.jpg"}
                            width={40}
                            height={40}
                            className="rounded-full object-cover w-[40px] h-[40px]"
                        />
                        <h3 className="font-normal text-xl text-[#5C8D89]">{userData.full_name}</h3>
                    </div>
                ) : (
                    <div className="flex flex-row gap-2 justify-center items-center">
                        <ButtonGesture>
                            <Link
                                href={"/login"}
                                className="font-normal text-[#3CB371] sm:px-6 px-3 py-2"
                            >
                                Masuk
                            </Link>
                        </ButtonGesture>
                        <ButtonGesture>
                            <Link
                                href={"/register"}
                                className="font-white rounded-md text-white bg-[#5C8D89] sm:px-6 px-3 py-2"
                            >
                                Daftar
                            </Link>
                        </ButtonGesture>
                    </div>
                )}
            </div>
        </div>
    );
}