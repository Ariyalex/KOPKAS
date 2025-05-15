'use client'

import { Table, Badge, Dropdown, Button, IconButton, Input, InputGroup, CheckboxGroup, Checkbox } from "rsuite";
import { Card } from "../common/card";
import { CircleCheckBig, FileText, MessagesSquare, Users, ExternalLink, SortAsc, SortDesc, Filter, Search, X } from "lucide-react";
import { laporanDummyData, LaporanData } from "./dummy/laporan_dummy";
import { Tag } from "../common/tag";
import { useState, useEffect } from "react";
import { LaporanTablePreview } from "./table_preview_admin";

// Make sure to destructure these directly from Table
const { Column, HeaderCell, Cell } = Table;

interface DashboardItem {
    title: string;
    Icon: React.ElementType;
    jumlah: number;
}

export const DashboardContent: DashboardItem[] = [
    {
        title: "Laporan Masuk",
        Icon: FileText,
        jumlah: 23,
    },
    {
        title: "Laporan Selesai",
        Icon: CircleCheckBig,
        jumlah: 12,
    },
    {
        title: "Total Pengguna",
        Icon: Users,
        jumlah: 44,
    },
    {
        title: "Konsultasi Aktif",
        Icon: MessagesSquare,
        jumlah: 7,
    },
]

export function DashboardAdmin() {
    return (
        <div className="flex flex-col h-auto gap-5 flex-5/6 px-8 py-5 bg-[#F5FFFA]">
            <div>
                <h1 className="text-[#1F2937] text-2xl font-semibold">Dashboard</h1>
                <p className="text-[#6B7280]">Overview data terkini</p>
            </div>
            <div className="flex flex-row gap-5 w-full">
                {DashboardContent.map(({ title, Icon, jumlah }, index) => (
                    <Card key={index} shadow="shadow-xs" className="flex flex-row justify-between items-center flex-1">
                        <div className="flex flex-col">
                            <h3 className="text-base text-[#6B7280]">{title}</h3>
                            <h2 className="text-2xl font-bold">{jumlah}</h2>
                        </div>
                        <div className="bg-[#E6FFFA] p-3 rounded-xl">
                            <Icon color="#3CB371" />
                        </div>
                    </Card>
                ))}
            </div>

            {/* Menggunakan komponen LaporanTablePreview untuk menampilkan pratinjau */}
            <LaporanTablePreview />
        </div>
    );
}
