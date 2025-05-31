'use client'

import Image from "next/image";
import Link from "next/link";
import { useUserStore } from "@/stores/userStore";
import { FilledButton } from "../common/button";
import { AlignJustify } from "lucide-react";
import { Dropdown } from "rsuite";
import React from "react";
import { navContent } from "./nav_user";
import { usePathname } from "next/navigation";
import clsx from "clsx";

const renderIconButton = (props: any, ref: React.Ref<any>) => {
    return (
        <FilledButton
            {...props}
            ref={ref}
            width="w-fit"
            bgColor="bg-none"
            paddingx="px-2"
            paddingy="py-1"
        >
            <AlignJustify color="#74B49B" />
        </FilledButton>
    );
};

export function HeaderUser() {
    const { currentUser } = useUserStore();
    const pathname = usePathname();

    return (
        <div className="flex items-center shadow-sm flex-row md:px-20 px-5 py-4 justify-between w-full h-fit z-50 top-0 bg-white">
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
            <div className="md:flex flex-row hidden gap-2 items-center justify-center">
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
            <div className="md:hidden block">
                <Dropdown renderToggle={renderIconButton} noCaret placement="bottomEnd">
                    {navContent.map(({ title, Icon, route }, index) => {
                        const isActive = pathname == route;
                        return (
                            <Dropdown.Item key={index} as={Link} href={route} icon={<Icon color="#5C8D89" />} className={
                                "flex felx-col p-2 gap-2 text-[#5C8D89] list"}>
                                <h3 className={clsx(
                                    "flex felx-col p-2 gap-2 text-[#5C8D89] rounded-md",
                                    isActive
                                        ? "font-bold bg-[#A7D7C5]"
                                        : "font-normal"
                                )}>{title}</h3></Dropdown.Item>
                        )
                    })}
                </Dropdown>
            </div>
        </div>
    );
}