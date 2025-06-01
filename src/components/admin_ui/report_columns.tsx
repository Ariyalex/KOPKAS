'use client'

import { ExternalLink } from "lucide-react";
import { ColumnDef } from '@tanstack/react-table';
import { StatusTag } from "../common/tag";
import Link from "next/link";
import { Report } from "@/stores/reportStore";


// Create exportable column definitions with a navigation handler for the action button
export const createReportColumns = (
    onNavigate?: (id: string) => void // Optional navigation function for handling link clicks
): ColumnDef<Report, any>[] => [
        {
            id: 'id',
            accessorKey: 'id',
            header: () => (
                <div className="text-[#6B7280] font-medium text-base">ID Laporan</div>
            ),
            cell: info => <div>{info.getValue() as string}</div>,
        }, {
            id: 'reporter_full_name',
            accessorFn: (row) => row.reporter_full_name || 'Anonymous',
            header: () => (
                <div className="text-[#6B7280] font-medium text-base">Pelapor</div>
            ),
            cell: info => <div>{info.getValue() as string}</div>,
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

                // If there's a custom navigation handler, use it
                if (onNavigate) {
                    return (
                        <div className="flex items-center justify-center">
                            <button
                                onClick={() => onNavigate(id)}
                                className="flex items-center justify-center text-green-600 hover:text-green-800 cursor-pointer"
                            >
                                <ExternalLink size={16} className="mr-1" />
                                <span>Detail</span>
                            </button>
                        </div>
                    );
                }

                // Otherwise default to a Link component
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
    ];
