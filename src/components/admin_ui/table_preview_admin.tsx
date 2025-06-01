'use client'

import { useReportStore } from "@/stores/reportStore"; // Menggunakan store untuk mengambil data
import { ChevronDown, ChevronUp, ExternalLink } from "lucide-react";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { Button } from "rsuite";
import { Card } from "../common/card";
import { StatusTag } from "../common/tag";
import { Loading } from "../common/loading";
import {
    useReactTable,
    getCoreRowModel,
    getSortedRowModel,
    SortingState,
    flexRender,
    createColumnHelper,
    ColumnDef
} from '@tanstack/react-table';

// Define report data type for TanStack Table
type Report = {
    id: string;
    reporter_full_name: string;
    created_at: string;
    status: string; // We'll cast it to the proper type in the StatusTag component
    title?: string;
    description?: string;
}

export function LaporanTablePreview() {
    const { reports, fetchReports, isLoading } = useReportStore();  // Mengambil data laporan dari store
    const [loading, setLoading] = useState<boolean>(false);
    const [sorting, setSorting] = useState<SortingState>([
        { id: 'created_at', desc: true }
    ]); useEffect(() => {
        async function getReports() {
            setLoading(true);
            await fetchReports(); // Mengambil laporan menggunakan fungsi store
            setLoading(false);
        }

        getReports();
    }, [fetchReports]);

    // Column definition for TanStack Table
    const columns = useMemo<ColumnDef<Report, any>[]>(
        () => [
            {
                id: 'id',
                accessorKey: 'id',
                header: () => (
                    <div className="text-[#6B7280] font-medium text-base">ID Laporan</div>
                ),
                cell: info => <div>{info.getValue() as string}</div>,
            },
            {
                id: 'reporter_full_name',
                accessorKey: 'reporter_full_name',
                header: () => (
                    <div className="text-[#6B7280] font-medium text-base">Pelapor</div>
                ),
                cell: info => <div>{(info.getValue() as string) || 'Anonymous'}</div>,
            },
            {
                id: 'created_at',
                accessorKey: 'created_at',
                header: () => (
                    <div className="text-[#6B7280] font-medium text-base">Tanggal</div>
                ),
                cell: info => {
                    const date = new Date(info.getValue() as string);
                    return (
                        <div>
                            {date.toLocaleDateString('id-ID', {
                                day: 'numeric',
                                month: 'long',
                                year: 'numeric',
                            })}
                        </div>
                    );
                },
            },
            {
                id: 'status',
                accessorKey: 'status',
                header: () => (
                    <div className="text-center text-[#6B7280] font-medium text-base">Status</div>
                ),
                cell: info => (
                    <div className="text-center">
                        <StatusTag status={info.getValue() as 'new' | 'in_progress' | 'completed' | 'rejected'} />
                    </div>
                ),
            },
            {
                id: 'action',
                header: () => (
                    <div className="text-center text-[#6B7280] font-medium text-base">Aksi</div>
                ),
                cell: info => {
                    const id = info.row.original.id;
                    return (
                        <div className="flex items-center justify-center">
                            <Link href={`/admin/report/${id}`}>
                                <button
                                    className="flex items-center justify-center text-green-600 hover:text-green-800 cursor-pointer"
                                >
                                    <ExternalLink size={16} className="mr-1" />
                                    <span>Detail</span>
                                </button>
                            </Link>
                        </div>
                    );
                },
            },
        ],
        []
    );

    // Create table instance
    const table = useReactTable({
        data: reports.slice(0, 5), // Show only the latest 5 reports
        columns,
        state: {
            sorting,
        },
        onSortingChange: setSorting,
        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel(),
    });

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

            {/* Table with Fixed Header and Scrollable Body */}
            <div className="w-[84vw] sm:w-full overflow-x-scroll rounded-md border border-gray-200 bg-white">
                <table className="w-full text-sm text-left">
                    <thead className="bg-[#E6FFFA] text-[#6B7280] sticky top-0 z-10">
                        {table.getHeaderGroups().map(headerGroup => (
                            <tr key={headerGroup.id}>
                                {headerGroup.headers.map(header => (
                                    <th
                                        key={header.id}
                                        className="px-6 py-3 font-medium text-base"
                                        style={{
                                            cursor: header.column.getCanSort() ? 'pointer' : 'default',
                                        }}
                                        onClick={header.column.getToggleSortingHandler()}
                                    >
                                        <div className="flex items-center gap-2">
                                            {flexRender(header.column.columnDef.header, header.getContext())}

                                            {/* Sorting indicators */}
                                            {header.column.getIsSorted() === 'asc' && (
                                                <ChevronUp size={16} className="text-[#3CB371]" />
                                            )}
                                            {header.column.getIsSorted() === 'desc' && (
                                                <ChevronDown size={16} className="text-[#3CB371]" />
                                            )}
                                        </div>
                                    </th>
                                ))}
                            </tr>
                        ))}
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr>
                                <td colSpan={table.getAllColumns().length} className="px-6 py-8  text-center text-gray-400">
                                    <Loading text="load data..." fullScreen={false} />
                                </td>
                            </tr>
                        ) : (
                            table.getRowModel().rows.map(row => (
                                <tr
                                    key={row.id}
                                    className="border-t border-gray-200 hover:bg-gray-50"
                                >
                                    {row.getVisibleCells().map(cell => (
                                        <td key={cell.id} className="px-6 py-4">
                                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                        </td>
                                    ))}
                                </tr>
                            )
                            ))}
                    </tbody>
                </table>
            </div>
        </Card>
    );
}
