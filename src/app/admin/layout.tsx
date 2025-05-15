import { HeaderAdmin } from "@/components/admin_ui/header_admin";
import { NavAdmin } from "@/components/admin_ui/nav_admin";

export default function Layout({ children }: { children: React.ReactNode }) {
    return (
        <main>
            <HeaderAdmin />
            <div className="flex flex-row w-full h-auto">
                <NavAdmin />
                {children}
            </div>
        </main>
    );
}