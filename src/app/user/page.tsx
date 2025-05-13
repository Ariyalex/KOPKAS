import { Card } from "@/components/common/card";
import { HeaderUser } from "@/components/user_ui/header_user";
import { NavUser } from "@/components/user_ui/nav_user";
import { DashboardMessage, DashboardUser } from "@/components/user_ui/dashboard_user";

export default function Page() {
    return (
        <main>
            <HeaderUser />
            <div className="p-8 flex flex-row gap-6 w-full h-screen">
                <NavUser className="flex-1/6" />
                <DashboardUser className="flex-3/6" />
                <DashboardMessage className="flex-2/6" />
            </div>
        </main>
    );
}
