import Image from "next/image";
import Link from "next/link";
import { Badge, Dropdown } from "rsuite";
import { AlignJustify, Bell, ChartLine, ClipboardList, LogOut, MessagesSquare } from "lucide-react";
import { FilledButton } from "../common/button";
import { navContentAdmin } from "./nav_admin";
import { handleLogout } from "@/utils/auth";
import clsx from "clsx";
import { usePathname, useRouter } from "next/navigation";
import { useUserStore } from "@/stores/userStore";
import { useEffect } from "react";

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

export function HeaderAdmin() {
    const pathname = usePathname();
    const router = useRouter();
    const { currentUser, fetchCurrentUser } = useUserStore();

    useEffect(() => {
        fetchCurrentUser();
    }, [fetchCurrentUser]);

    const onLogout = async () => {
        await handleLogout();
        router.push("/");
        router.refresh(); // Force refresh to ensure all state is cleared
    }

    return (
        <div className="flex items-center flex-row sm:px-10 px-5 py-4 justify-between w-full h-fit z-50 top-0 bg-white border-b-2 border-[#E5E7EB]">
            <div className="flex items-center gap-2">
                <Image
                    src={"/logo.svg"}
                    alt="logo"
                    width={24}
                    height={24}
                    className="w-[24px] h-[24px]"
                />
                <Link className="font-bold sm:block hidden text-2xl text-[#5C8D89]" href="/">KOPKAS</Link>
                <Link href={"/admin"} className="text-[#6B7280]">Admin Panel</Link>
            </div>
            <div className="md:flex hidden felx-row gap-2 items-center justify-center">
                <>
                    <Image
                        alt="profile"
                        src={currentUser?.photo || '/default_photo.png'}
                        width={40}
                        height={40}
                        className="rounded-full object-cover w-[40px] h-[40px]"
                    />
                    <h3 className="font-normal text-xl text-[#5C8D89]">{currentUser?.full_name}</h3>
                </>
            </div>
            <div className="md:hidden block">
                <Dropdown renderToggle={renderIconButton} noCaret placement="bottomEnd" className="z-20">
                    {navContentAdmin.map(({ title, Icon, route }, index) => {
                        const isActive = pathname == route;
                        return (
                            <Dropdown.Item
                                key={index} as={Link} href={route}
                                icon={<Icon color="#5C8D89" />}
                                className="text-[#5C8D89] list"
                            >
                                <h3 className={clsx(
                                    "flex felx-col p-2 gap-2 text-[#5C8D89] rounded-md",
                                    isActive
                                        ? "font-bold bg-[#A7D7C5]"
                                        : "font-normal"
                                )}>{title}</h3>
                            </Dropdown.Item>
                        )
                    })}
                    <Dropdown.Item as={"button"} onClick={onLogout} icon={<LogOut className="text-[#DC2626]" />}
                        className={
                            "text-[#DC2626] logouthov"}>
                        <h3 className={clsx(
                            "flex felx-col p-2 gap-2 text-[#DC2626]",
                        )}>Log Out</h3></Dropdown.Item>
                </Dropdown>
            </div>
        </div>
    );
}