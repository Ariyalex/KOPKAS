'use client'

import { LaporanData, laporanDummyData } from "./dummy/laporan_dummy";
import { Card } from "../common/card";
import Image from "next/image";
import { StatusTag } from "../common/tag";
import { FilledButton } from "../common/button";
import { Dropdown } from "rsuite";
import { SpinnerLoader } from "@/components/common/loading";
import { Notification, useToaster } from "rsuite";
import { useEffect, useState } from "react";
import Link from "next/link";
import CheckIcon from '@rsuite/icons/Check';

interface DetailLaporanProps {
    params: { id: string };
}

export function DetailLaporan({ params }: DetailLaporanProps) {
    //unutk mendapatkan id
    const id = parseInt(params.id);

    //controller
    const [data, setData] = useState<LaporanData | undefined>(undefined);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [statusUpdated, setStatusUpdated] = useState<boolean>(false);
    const [lastUpdatedStatus, setLastUpdatedStatus] = useState<string | null>(null);

    //notifikasi
    const toaster = useToaster();


    useEffect(() => {
        //find data berdasarkan id
        const reportData = laporanDummyData.find(item => item.id === id);
        setData(reportData);
    }, [id]);

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

    const handleStatusChange = (value: string) => {
        // Skip if trying to set the same status
        if (data?.status === value.toLowerCase()) {
            showNotification('info', `Status laporan sudah ${value}`);
            return;
        }

        setIsLoading(true);
        setStatusUpdated(false);

        // Simulate API call with timeout
        //megirim ke database
        setTimeout(() => {
            try {
                // Map dropdown values to status values in the data
                const statusMap: Record<string, 'baru' | 'diproses' | 'selesai' | 'ditolak'> = {
                    'Baru': 'baru',
                    'Diproses': 'diproses',
                    'Selesai': 'selesai',
                    'Ditolak': 'ditolak'
                };

                const newStatus = statusMap[value];
                // Update the status in the dummy data for demonstration
                if (data) {
                    const updatedData: LaporanData = {
                        ...data,
                        status: newStatus
                    };
                    setData(updatedData);
                }

                // Update in the main data array (this is just for demo purposes)
                const index = laporanDummyData.findIndex(item => item.id === id);
                if (index !== -1) {
                    laporanDummyData[index].status = newStatus;
                }

                // Show notification and update status indicator
                showNotification('success', `Status laporan berhasil diperbarui menjadi ${value}`);
                setStatusUpdated(true);
                setLastUpdatedStatus(value);

                // Reset status updated indicator after 3 seconds
                setTimeout(() => {
                    setStatusUpdated(false);
                }, 3000);

            } catch (error) {
                showNotification('error', 'Gagal memperbarui status laporan');
                console.error('Error updating status:', error);
            } finally {
                setIsLoading(false);
            }
        }, 800);  // Simulate API delay
    };

    if (!data) {
        return <div className="h-screen w-screen bg-white flex flex-col gap-4 px-8 py-2 items-center justify-center">
            <h1 className="text-[#1F2937] text-2xl font-semibold">Laporan tidak ditemukan</h1>
            <p className="text-[#6B7280]">Laporan dengan id: {id} tidak ditemukan</p>
        </div>
    } const CustomDropdown = ({ ...props }) => {
        // Map of status values to display values
        const statusDisplayMap: Record<string, string> = {
            'baru': 'Baru',
            'diproses': 'Diproses',
            'selesai': 'Selesai',
            'ditolak': 'Ditolak'
        };

        // Get all possible statuses
        const allStatuses = ['Baru', 'Diproses', 'Selesai', 'Ditolak'];

        // Filter out the current status to avoid redundant selections
        const availableStatuses = allStatuses.filter(status =>
            status !== statusDisplayMap[data?.status || '']
        );

        return (
            <Dropdown {...props} disabled={isLoading}>
                {availableStatuses.map((status) => (
                    <Dropdown.Item key={status} onSelect={() => handleStatusChange(status)}>
                        {status}
                    </Dropdown.Item>
                ))}
            </Dropdown>
        );
    };

    return (
        <div className="h-screen w-screen bg-white flex flex-col gap-4 px-8 py-2">
            <div>
                <h1 className="text-[#1F2937] text-2xl font-semibold">Detail Laporan</h1>
                <p className="text-[#6B7280]">Lihat detail laporan yang dikirim pelapor</p>
            </div>
            <div className="flex flex-row gap-5 w-full h-full py-4">
                <Card bgColor="bg-[#F4F9F4]" padding="px-5 py-3" className="flex flex-col gap-4 flex-4/6" overflow="overflow-visible">
                    <h1 className="font-semibold text-[#5C8D89] text-2xl">Laporan {id}</h1>
                    <div className="flex flex-col gap-4 justify-around h-full">
                        <Card bgColor="bg-white" className="flex flex-row gap-14" padding="py-4 px-10" overflow="overflow-visible">
                            <div className="flex flex-col items-center gap-1.5 justify-center">
                                <Image
                                    src="/dummy.jpg"
                                    alt={data.pelapor}
                                    width={100} height={100}
                                    className="w-[70px] h-[70px] rounded-full object-cover"
                                />
                                <h3 className="text-[#5C8D89] font-medium">{data.pelapor}</h3>
                            </div>
                            <div className="flex flex-col gap-1.5">
                                <div className="flex flex-col gap-1.5">
                                    <h3 className="text-[#5C8D89] text-base font-medium">Tanggal Melaporkan</h3>
                                    <p className="text-sm text-[#5C8D89]">{data.tanggal.toLocaleDateString('id-ID', {
                                        day: 'numeric',
                                        month: 'long',
                                        year: 'numeric',
                                    })}</p>
                                </div>
                                <div className="flex flex-col gap-1.5">
                                    <h3 className="text-[#5C8D89] text-base font-medium">Status Laporan</h3>                                    <div className="flex flex-row gap-5 items-center">                                        <div
                                        className="transition-all duration-300"
                                        style={{
                                            transform: statusUpdated ? 'scale(1.05)' : 'scale(1)',
                                            boxShadow: statusUpdated ? '0 0 8px rgba(16, 185, 129, 0.5)' : 'none',
                                            borderRadius: '9999px'
                                        }}
                                    >
                                        <StatusTag status={data.status} />
                                    </div>
                                        <CustomDropdown
                                            title={isLoading ? "Memperbarui..." : "Perbarui Status"}
                                            placement="rightStart"
                                            size="sm"
                                            className={`transition-all ${isLoading ? 'opacity-70 cursor-not-allowed' : 'opacity-100'}`}
                                        />                                        {isLoading && (
                                            <div className="ml-2">
                                                <SpinnerLoader />
                                            </div>
                                        )}
                                        {statusUpdated && (
                                            <div
                                                className="flex items-center text-green-600"
                                                style={{
                                                    animation: 'fadeIn 0.5s ease-in-out',
                                                    transition: 'all 0.3s ease'
                                                }}
                                            >
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
                                        {data.datetime.toLocaleDateString('id-ID', {
                                            day: '2-digit',
                                            month: '2-digit',
                                            year: '2-digit',
                                        })}
                                    </p>
                                    <p className="pl-3">
                                        {data.datetime.toLocaleTimeString('id-ID', {
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
                                        {data.lokasi}
                                    </p>
                                </div>
                            </Card>
                            <Card bgColor="bg-white" padding="px-5 py-2" width="w-full">
                                <h2 className="text-[#5C8D89] font-bold text-sm">Jenis Kekerasan yang Dialami</h2>
                                <div className="bg-[#A7D7C5] rounded-md flex flex-row px-4 my-6 py-2">
                                    <p >
                                        {data.kekerasan}
                                    </p>
                                </div>
                            </Card>
                            <Card bgColor="bg-white" padding="px-5 py-2" width="w-full" className="flex flex-col justify-between">
                                <h2 className="text-[#5C8D89] font-bold text-sm">Bukti Pendukung</h2>
                                {data.bukti ? (
                                    <div className="flex flex-row gap-3 items-center h-full">
                                        <Link href={data.bukti} download target="_blank" rel="noopener noreferrer">
                                            <FilledButton bgColor="bg-[#5C8D89]" paddingx="px-3" paddingy="py-2">
                                                Download File
                                            </FilledButton>
                                        </Link>
                                        <div className="mt-2 text-sm">
                                            <p className="truncate max-w-[300px] font-medium">
                                                File: <span className="font-medium">{data.bukti.split('/').pop()}</span>
                                            </p>
                                            <p className="truncate max-w-[300px] font-medium">
                                                Type: <span className="font-medium">{data.bukti.split('.').pop()?.toUpperCase()}</span>
                                            </p>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="bg-gray-100 rounded-md flex flex-row items-center justify-center px-4 my-6 py-6 text-gray-500">
                                        Tidak ada bukti pendukung yang dilampirkan
                                    </div>
                                )}
                            </Card>
                        </div>
                        <Link href={"/admin/report"}>
                            <FilledButton bgColor="bg-[#5C8D89]" paddingx="px-3" paddingy="py-2">
                                Kembali
                            </FilledButton>
                        </Link>

                    </div>
                </Card>
                <Card bgColor="bg-[#F4F9F4]" className="flex-2/6 flex flex-col gap-4" height="h-full" padding="px-5 py-4">
                    <h1 className="font-semibold text-[#5C8D89] text-2xl">Kronologi Kejadian</h1>
                    {data.kronologi ? (
                        <div className="bg-white rounded-md p-4 text-black text-sm overflow-auto max-h-[calc(100vh-200px)]">
                            {data.kronologi}
                        </div>
                    ) : (
                        <div className="bg-gray-100 rounded-md flex flex-row items-center justify-center px-4 py-6 text-gray-500">
                            Tidak ada kronologi kejadian yang dilaporkan
                        </div>
                    )}
                </Card>
            </div>
        </div>
    )
}