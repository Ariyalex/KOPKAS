'use client'

import { useEffect, useState } from "react";
import { Card } from "../common/card";
import { ReportContentDummy, ReportsItemDummy } from "./dummy/reports_dummy";
import { StatusTag } from "../common/tag";
import { FilledButton } from "../common/button";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface DetailLaporanUserProps {
    params: { id: string };
}

export function DetailLaporanUser({ params }: DetailLaporanUserProps) {
    const router = useRouter()
    const { id } = params
    const { currentReport, getReportById } = useReportStore()  // Ambil fungsi dari store untuk mengambil data laporan
    const [loading, setLoading] = useState(true)

    // Ambil data laporan berdasarkan id
    useEffect(() => {
        const foundReport = ReportContentDummy.find(item => item.id === params.id);

        if (foundReport) {
            // Transform the data to match the component's expected format
            setReport({
                id: foundReport.id,
                created_at: foundReport.submitted,
                status: foundReport.status,
                incident_date: foundReport.tanggal_kejadian,
                location: foundReport.lokasi || '',
                title: foundReport.kekerasan || '',
                description: foundReport.kronologi || '',
                evidence_files: foundReport.bukti ? [foundReport.bukti] : []
            });
        }
    }, [params.id]);


    // Show loading or not found message if report isn't loaded yet
    if (!report) {
        return (
            <div className="h-screen w-screen bg-white flex items-center justify-center">
                <p>Laporan tidak ditemukan atau sedang dimuat...</p>
            </div>
        );
    }

    return (
        <div className="h-full w-full rounded-lg bg-white flex flex-col gap-4 px-7 py-7">
            <div>
                <h1 className="text-[#1F2937] text-2xl font-semibold">Detail Laporan</h1>
                <p className="text-[#6B7280]">Lihat detail laporan yang dikirim pelapor</p>
            </div>
            <div className="flex flex-row gap-5 w-full h-full py-4">
                <Card bgColor="bg-[#F4F9F4]" padding="px-5 py-3" className="flex flex-col gap-4 flex-4/6" overflow="overflow-visible">
                    <h1 className="font-semibold text-[#5C8D89] text-2xl">Laporan #{report.id.substring(0, 8).toUpperCase()}</h1>
                    <div className="flex flex-col gap-4 h-full">
                        <Card bgColor="bg-white" className="flex flex-row gap-14" padding="py-4 px-10" overflow="overflow-visible">
                            <div className="flex flex-row gap-10">
                                <div className="flex flex-col gap-1.5">
                                    <h3 className="text-[#5C8D89] text-base font-medium">Tanggal Melaporkan</h3>
                                    <p className="text-sm text-[#5C8D89]">
                                        {typeof report.created_at === 'string'
                                            ? report.created_at
                                            : new Date(report.created_at).toLocaleDateString('id-ID', {
                                                day: 'numeric',
                                                month: 'long',
                                                year: 'numeric',
                                            })
                                        }
                                    </p>
                                </div>
                                <div className="flex flex-col gap-1.5">
                                    <h3 className="text-[#5C8D89] text-base font-medium">Status Laporan</h3>
                                    <div className="flex flex-row gap-5 items-center">
                                        <StatusTag status={report.status} />
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
                                <h2 className="text-[#5C8D89] font-bold text-sm">Bukti Pendukung</h2>                                {report.evidence_files && report.evidence_files.length > 0 ? (
                                    <div className="flex flex-row gap-3 items-center h-full">
                                        {report.evidence_files.map((file: string, index: number) => (
                                            <div key={index} className="flex flex-row gap-3 items-center">
                                                <Link href={file} download target="_blank" rel="noopener noreferrer">
                                                    <FilledButton bgColor="bg-[#5C8D89]" paddingx="px-3" paddingy="py-2">
                                                        Download File
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
}