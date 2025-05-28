'use client'

import CheckIcon from '@rsuite/icons/Check';
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Dropdown, Loader, Notification, useToaster } from "rsuite";
import { FilledButton } from "../common/button";
import { Card } from "../common/card";
import { StatusTag } from "../common/tag";

// import keperluan backend
import type { Database } from '@/lib/database.types';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useRouter } from 'next/navigation';

interface DetailLaporanProps {
    params: { id: string };
}

interface Report {
    id: string;
    title: string;
    description: string;
    location: string;
    incident_date: string;
    status: 'new' | 'in_progress' | 'completed' | 'rejected';
    evidence_files: string[] | null;
    category_id: string;
    reporter_id: string;
    reporter: {
        id: string;
        full_name: string;
        email: string;
        photo: string | null;
    } | null;
    created_at: string;
}

export function DetailLaporan({ params }: DetailLaporanProps) {
    const router = useRouter();

    // supabase
    const supabase = createClientComponentClient<Database>();

    //controller
    const [report, setReport] = useState<Report | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [statusUpdated, setStatusUpdated] = useState<boolean>(false);
    const [lastUpdatedStatus, setLastUpdatedStatus] = useState<string | null>(null);

    //notifikasi
    const toaster = useToaster();

    useEffect(() => {
        async function fetchReport() {
            try {
                const { data, error } = await supabase
                    .from('reports')
                    .select(`
                        *,
                        reporter:users!reports_reporter_id_fkey (
                            id,
                            full_name,
                            email,
                            photo
                        )
                    `)
                    .eq('id', params.id)
                    .single();

                if (error) throw error;
                setReport(data as Report);
            } catch (error) {
                console.error('Error fetching report:', error);
                showNotification('error', 'Gagal memuat data laporan');
            } finally {
                setIsLoading(false);
            }
        }

        fetchReport();
    }, [params.id, supabase]);

    const showNotification = (type: 'success' | 'error' | 'info', message: string) => {
        toaster.push(
            <Notification type={type} header={
                type === 'success' ? 'Sukses' :
                    type === 'error' ? 'Error' : 'Informasi'
            } closable>
                {message}
            </Notification>,
            { placement: 'topEnd' }
        );
    };

    const getStatusConfig = (status: string): { label: string; className: string } => {
        const config = {
            'new': {
                label: 'Baru',
                className: 'bg-blue-100 text-blue-800'
            },
            'in_progress': {
                label: 'Diproses',
                className: 'bg-yellow-100 text-yellow-800'
            },
            'completed': {
                label: 'Selesai',
                className: 'bg-green-100 text-green-800'
            },
            'rejected': {
                label: 'Ditolak',
                className: 'bg-red-100 text-red-800'
            }
        }[status];

        return config || { label: 'Tidak diketahui', className: 'bg-gray-100 text-gray-800' };
    };

    const handleStatusChange = async (newStatus: 'new' | 'in_progress' | 'completed' | 'rejected') => {
        if (!report) return;

        setIsLoading(true);
        try {
            const { error } = await supabase
                .from('reports')
                .update({
                    status: newStatus,
                    updated_at: new Date().toISOString()
                })
                .eq('id', report.id);

            if (error) throw error;

            // Get status label from config
            const { label } = getStatusConfig(newStatus);

            // Create report update record
            await supabase.from('report_updates').insert({
                report_id: report.id,
                old_status: report.status,
                new_status: newStatus,
                notes: `Status diperbarui ke ${label}`
            });

            setReport(prev => prev ? { ...prev, status: newStatus } : null);
            showNotification('success', `Status laporan berhasil diperbarui menjadi ${label}`);
            setStatusUpdated(true);
            setLastUpdatedStatus(label);

            setTimeout(() => setStatusUpdated(false), 3000);
        } catch (error) {
            console.error('Error updating status:', error);
            showNotification('error', 'Gagal memperbarui status laporan');
        } finally {
            setIsLoading(false);
        }
    };

    if (isLoading) {
        return <div className="h-screen w-screen bg-white flex items-center justify-center">
            <Loader size="lg" />
        </div>;
    }

    if (!report) {
        return <div className="h-screen w-screen bg-white flex flex-col gap-4 px-8 py-2 items-center justify-center">
            <h1 className="text-[#1F2937] text-2xl font-semibold">Laporan tidak ditemukan</h1>
            <p className="text-[#6B7280]">Laporan dengan id: {params.id} tidak ditemukan</p>
        </div>;
    }

    return (
        <div className="h-screen w-screen bg-white flex flex-col gap-2 px-8 py-2">
            <div>
                <h1 className="text-[#1F2937] text-2xl font-semibold">Detail Laporan</h1>
                <p className="text-[#6B7280]">Lihat detail laporan yang dikirim pelapor</p>
            </div>
            <div className="flex flex-row gap-5 w-full h-full py-4">
                <Card bgColor="bg-[#F4F9F4]" padding="px-5 py-3" className="flex flex-col gap-4 flex-4/6" overflow="overflow-visible">
                    <h1 className="font-semibold text-[#5C8D89] text-2xl">Laporan #{report.id.substring(0, 8).toUpperCase()}</h1>
                    <div className="flex flex-col gap-4 justify-around h-full">
                        <Card bgColor="bg-white" className="flex flex-row gap-14" padding="py-4 px-10" overflow="overflow-visible">
                            <div className="flex flex-col items-center gap-1.5 justify-center">
                                {report.reporter?.photo ? (
                                    <>
                                        <Image
                                            src={report.reporter.photo}
                                            alt={report.reporter.full_name || 'Profile'}
                                            width={100} height={100}
                                            className="w-[70px] h-[70px] rounded-full object-cover"
                                        />
                                        <h3 className="text-[#5C8D89] font-medium">{report.reporter.full_name}</h3>
                                    </>
                                ) : (
                                    <>
                                        <div className="w-[70px] h-[70px] rounded-full bg-gray-200 flex items-center justify-center">
                                            <span className="text-gray-400">No Photo</span>
                                        </div>
                                        <h3 className="text-[#5C8D89] font-medium">{report.reporter?.full_name || 'Unknown'}</h3>
                                    </>
                                )}
                            </div>
                            <div className="flex flex-col gap-1.5">
                                <div className="flex flex-col gap-1.5">
                                    <h3 className="text-[#5C8D89] text-base font-medium">Tanggal Melaporkan</h3>
                                    <p className="text-sm text-[#5C8D89]">{new Date(report.created_at).toLocaleDateString('id-ID', {
                                        day: 'numeric',
                                        month: 'long',
                                        year: 'numeric',
                                    })}</p>
                                </div>
                                <div className="flex flex-col gap-1.5">
                                    <h3 className="text-[#5C8D89] text-base font-medium">Status Laporan</h3>
                                    <div className="flex flex-row gap-5 items-center">
                                        <StatusTag status={report.status} />
                                        <Dropdown
                                            title={isLoading ? "Memperbarui..." : "Perbarui Status"}
                                            placement="rightStart"
                                            size="sm"
                                            disabled={isLoading}
                                            className={`transition-all ${isLoading ? 'opacity-70 cursor-not-allowed' : 'opacity-100'}`}
                                        >
                                            <Dropdown.Item onSelect={() => handleStatusChange('new')}>Baru</Dropdown.Item>
                                            <Dropdown.Item onSelect={() => handleStatusChange('in_progress')}>Diproses</Dropdown.Item>
                                            <Dropdown.Item onSelect={() => handleStatusChange('completed')}>Selesai</Dropdown.Item>
                                            <Dropdown.Item onSelect={() => handleStatusChange('rejected')}>Ditolak</Dropdown.Item>
                                        </Dropdown>
                                        {isLoading && <Loader size="sm" />}
                                        {statusUpdated && (
                                            <div className="flex items-center text-green-600">
                                                <CheckIcon style={{ marginRight: 4 }} />
                                                <span className="text-xs">Diperbarui ke {lastUpdatedStatus}</span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </Card>
                        <div className="grid grid-cols-2 gap-4">
                            <Card bgColor="bg-white" padding="px-5 py-2" width="w-full">
                                <h2 className="text-[#5C8D89] font-bold text-sm">Tanggal dan Waktu Kejadian</h2>
                                <div className="bg-[#A7D7C5] rounded-md flex flex-row px-4 my-6 py-2">
                                    <p className="border-r-[1px] border-[#5C8D89] pr-3">
                                        {new Date(report.incident_date).toLocaleDateString('id-ID', {
                                            day: '2-digit',
                                            month: '2-digit',
                                            year: '2-digit',
                                        })}
                                    </p>
                                    <p className="pl-3">
                                        {new Date(report.incident_date).toLocaleTimeString('id-ID', {
                                            hour: '2-digit',
                                            minute: '2-digit',
                                        })}
                                    </p>
                                </div>
                            </Card>
                            <Card bgColor="bg-white" padding="px-5 py-2" width="w-full">
                                <h2 className="text-[#5C8D89] font-bold text-sm">Lokasi Kejadian</h2>
                                <div className="bg-[#A7D7C5] rounded-md flex flex-row px-4 my-6 py-2">
                                    <p >
                                        {report.location}
                                    </p>
                                </div>
                            </Card>
                            <Card bgColor="bg-white" padding="px-5 py-2" width="w-full">
                                <h2 className="text-[#5C8D89] font-bold text-sm">Jenis Kekerasan yang Dialami</h2>
                                <div className="bg-[#A7D7C5] rounded-md flex flex-row px-4 my-6 py-2">
                                    <p >
                                        {report.title}
                                    </p>
                                </div>
                            </Card>
                            <Card bgColor="bg-white" padding="px-5 py-2" width="w-full" className="flex flex-col justify-between">
                                <h2 className="text-[#5C8D89] font-bold text-sm">Bukti Pendukung</h2>
                                {report.evidence_files && report.evidence_files.length > 0 ? (
                                    <div className="flex flex-row gap-3 items-center h-full">
                                        {report.evidence_files.map((file, index) => (
                                            <div key={index} className="flex flex-row gap-3 items-center">
                                                <Link href={file} download target="_blank" rel="noopener noreferrer">
                                                    <FilledButton bgColor="bg-[#5C8D89]" paddingx="px-3" paddingy="py-2">
                                                        Download File {index + 1}
                                                    </FilledButton>
                                                </Link>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="bg-gray-100 rounded-md flex flex-row items-center justify-center px-4 my-6 py-6 text-gray-500">
                                        Tidak ada bukti pendukung yang dilampirkan
                                    </div>
                                )}
                            </Card>
                        </div>
                    </div>

                    <div className='w-fit'>
                        <FilledButton onClick={router.back} width='w-fit'>
                            Kembali
                        </FilledButton>
                    </div>
                </Card>
                {/* Kronologi Section */}
                <Card bgColor="bg-[#F4F9F4]" className="flex-2/6 flex flex-col gap-4" height="h-full" padding="px-5 py-4">
                    <h1 className="font-semibold text-[#5C8D89] text-2xl">Kronologi Kejadian</h1>
                    <div className="bg-white rounded-md p-4 text-black text-sm overflow-auto max-h-[calc(100vh-200px)]">
                        {report.description || 'Tidak ada kronologi kejadian yang dilaporkan'}
                    </div>
                </Card>
            </div>
        </div>
    )
};