import Image from "next/image";
import Link from "next/link";
import { DummyUsers } from "../admin_ui/dummy/chat_dummy";
import { Badge, Dropdown } from "rsuite";
import { AlignJustify, Bell, ChartLine, ClipboardList, LogOut, MessagesSquare } from "lucide-react";
import { FilledButton } from "../common/button";
import { handleLogout, navContentAdmin } from "./nav_admin";
import clsx from "clsx";
import { usePathname, useRouter } from "next/navigation";

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

    const onLogout = async () => {
        await handleLogout();
        router.push("/");
    }

    // Mengambil data user dari DummyUsers
    const adminData = DummyUsers.find(admin => admin.role === "admin");

    return (
        <div className="flex items-center flex-row sm:px-10 px-5 py-4 justify-between w-full h-fit z-50 top-0 bg-white border-b-2 border-[#E5E7EB]">
            <div className="flex  items-center gap-2">
                <Image
                    src={"/logo.svg"}
                    alt="logo"
                    width={24}
                    height={24}
                    className="w-[24px] h-[24px] block sm:hidden"
                />
                <Link className="font-bold sm:block hidden text-2xl text-[#5C8D89]" href="/">KOPKAS</Link>
                <Link href={"/admin"} className="text-[#6B7280]">Admin Panel</Link>
            </div>
            <div className="md:flex hidden felx-row gap-2 items-center justify-center">
                {adminData && (
                    <>
                        <Badge content={3} className="mr-5">
                            <button >
                                <Bell />
                            </button>
                        </Badge>
                        <Image
                            alt="profile"
                            src={adminData.photo}
                            width={40}
                            height={40}
                            className="rounded-full object-cover w-[40px] h-[40px]"
                        />
                        <h3 className="font-normal text-xl text-[#5C8D89]">{adminData.name}</h3>
                    </>
                )}
            </div>
            <div className="md:hidden block">
                <Dropdown renderToggle={renderIconButton} noCaret placement="bottomEnd">
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