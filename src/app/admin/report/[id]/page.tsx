'use client'

import { DetailLaporan } from "@/components/admin_ui/detail_laporan"

import { useParams } from "next/navigation";

export default function Page() {
    const params = useParams<{ id: string }>();

    return (
        <DetailLaporan params={{ id: params.id }} />
    )
}