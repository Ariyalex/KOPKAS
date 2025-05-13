import { HeaderUser } from "@/components/user_ui/header_user";
import { NavUser } from "@/components/user_ui/nav_user";

export default function Layout({ children }: { children: React.ReactNode }) {
    return (
        <main>
            <HeaderUser />
            <div className="p-8 flex flex-row gap-6 w-full h-screen">
                <NavUser className="flex-1/6" />
                {children}
            </div>
        </main>
    );
}