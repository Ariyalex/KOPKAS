import { ChatUser } from "@/components/user_ui/chat_user";
import { DashboardMessage } from "@/components/user_ui/dashboard_user";

export default function Page() {
    return (
        <div className="flex flex-row flex-5/6 gap-6">
            <ChatUser className="w-full" />
        </div>
    );
}
