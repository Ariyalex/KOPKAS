'use client'

import { ExternalLink } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Button, Table } from "rsuite";
import { Card } from "../common/card";
import { StatusTag } from "../common/tag";

// import keperluan backend
import type { Database } from '@/lib/database.types';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

interface Report {
    id: string;
    title: string;
    status: 'new' | 'in_progress' | 'completed' | 'rejected';
    created_at: string;
    reporter: {
        full_name: string;
    } | null;
}

const { Column, HeaderCell, Cell } = Table;

// Komponen LaporanTablePreview untuk menampilkan tabel preview laporan di dashboard
export function LaporanTablePreview() {
    const supabase = createClientComponentClient<Database>();
    const [reports, setReports] = useState<Report[]>([]);
    const [loading, setLoading] = useState<boolean>(false);

    useEffect(() => {
        async function fetchReports() {
            try {
                const { data, error } = await supabase
                    .from('reports')
                    .select(`
                        id,
                        title,
                        status,
                        created_at,
                        reporter:reporter_id (
                            full_name
                        )
                    `)
                    .order('created_at', { ascending: false })
                    .limit(5);

                if (error) throw error;
                
                // Perbaikan type assertion
                if (data) {
                    setReports(data as unknown as Report[]);
                } else {
                    setReports([]);
                }

            } catch (error) {
                console.error('Error fetching reports:', error);
                setReports([]);
            } finally {
                setLoading(false);
            }
        }

        fetchReports();
    }, [supabase]);

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
                data={reports}
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
                    <Cell>
                        {(rowData: Report) => rowData.reporter?.full_name || 'Unknown'}
                    </Cell>
                </Column>
                <Column width={200} flexGrow={1} align="left">
                    <HeaderCell style={{ backgroundColor: '#E6FFFA' }}>
                        <h3 className="text-[#6B7280] font-medium text-base">Tanggal Masuk</h3>
                    </HeaderCell>
                    <Cell>
                        {(rowData: Report) => {
                            const date = new Date(rowData.created_at);
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
