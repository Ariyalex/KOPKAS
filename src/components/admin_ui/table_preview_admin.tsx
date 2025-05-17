'use client'

import { Table, Badge, Button, IconButton } from "rsuite";
import { Card } from "../common/card";
import { ExternalLink } from "lucide-react";
import { laporanDummyData, LaporanData } from "./dummy/laporan_dummy";
import { Tag, StatusTag } from "../common/tag";
import { useState, useEffect } from "react";
import Link from "next/link";

// Make sure to destructure these directly from Table
const { Column, HeaderCell, Cell } = Table;

// Komponen LaporanTablePreview untuk menampilkan tabel preview laporan di dashboard
export function LaporanTablePreview() {
    const [loading, setLoading] = useState<boolean>(false);

    // Get limited data for preview
    const getData = () => {
        // Return only the first 5 items
        return laporanDummyData.slice(0, 5);
    };

    return (
        <Card shadow="shadow-xs" className="w-full h-auto p-4">
            <div className="flex flex-col gap-4 mb-4">
                <div className="flex justify-between items-center">
                    <h2 className="text-xl font-semibold">Laporan Terbaru</h2>
                    <Link href="/admin/report">
                        <Button appearance="ghost" className="text-[#3CB371]">
                            Lihat Semua Laporan
                        </Button>
                    </Link>
                </div>
            </div>

            <Table
                data={getData()}
                height={300}
                hover={true}
                rowClassName={(rowData) => "hover:bg-[#F4F9F4]"}
                loading={loading}
                className="custom-sortable-table"
            >
                <Column width={150} align="left" fixed>
                    <HeaderCell style={{ backgroundColor: '#E6FFFA' }}>
                        <h3 className="text-[#6B7280] font-medium text-base">ID Laporan</h3>
                    </HeaderCell>
                    <Cell dataKey="id" />
                </Column>

                <Column width={200} flexGrow={2} align="left">
                    <HeaderCell style={{ backgroundColor: '#E6FFFA' }}>
                        <h3 className="text-[#6B7280] font-medium text-base">Pelapor</h3>
                    </HeaderCell>
                    <Cell dataKey="pelapor" />
                </Column>
                <Column width={200} flexGrow={1} align="left">
                    <HeaderCell style={{ backgroundColor: '#E6FFFA' }}>
                        <h3 className="text-[#6B7280] font-medium text-base">Tanggal</h3>
                    </HeaderCell>
                    <Cell dataKey="tanggal">
                        {(rowData) => {
                            const date = new Date(rowData.tanggal);
                            return date.toLocaleDateString('id-ID', {
                                day: 'numeric',
                                month: 'long',
                                year: 'numeric',
                            });
                        }}
                    </Cell>
                </Column>
                <Column width={120} flexGrow={1} align="center">
                    <HeaderCell style={{ backgroundColor: '#E6FFFA' }}>
                        <h3 className="text-[#6B7280] font-medium text-base">Status</h3>
                    </HeaderCell>
                    <Cell dataKey="status">
                        {(rowData) => <StatusTag status={rowData.status} />}
                    </Cell>
                </Column>
                <Column width={100} align="center" flexGrow={1}>
                    <HeaderCell style={{ backgroundColor: '#E6FFFA' }}>
                        <h3 className="text-[#6B7280] font-medium text-base">Aksi</h3>
                    </HeaderCell>
                    <Cell>
                        {(rowData) => (
                            <Link href={`/admin/report/${rowData.id}`}>
                                <button
                                    className="flex items-center justify-center text-green-600 hover:text-green-800 cursor-pointer"
                                >
                                    <ExternalLink size={16} className="mr-1" />
                                    <span>Detail</span>
                                </button>
                            </Link>
                        )}
                    </Cell>
                </Column>
            </Table>
        </Card>
    );
}
