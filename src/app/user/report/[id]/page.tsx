'use client'

import { DetailLaporanUser } from "@/components/user_ui/detail_report_user";
import { useParams } from "next/navigation";

export default function Page() {
    const params = useParams<{ id: string }>();

    return (
        <DetailLaporanUser params={{ id: params.id }} />
    )
}