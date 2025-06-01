'use client'

import { useReportStore } from "@/stores/reportStoreUser"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { FilledButton } from "../common/button"
import { Card } from "../common/card"
import { Loading } from "../common/loading"
import { StatusTag } from "../common/tag"

interface DetailLaporanUserProps {
    params: { id: string }  // Mendapatkan id dari URL
}

export function DetailLaporanUser({ params }: DetailLaporanUserProps) {
    const router = useRouter()
    const { id } = params
    const { currentReport, getReportById } = useReportStore()  // Ambil fungsi dari store untuk mengambil data laporan
    const [loading, setLoading] = useState(true)

    // Ambil data laporan berdasarkan id
    useEffect(() => {
        const fetchReport = async () => {
            await getReportById(id)  // Memanggil fungsi untuk mengambil laporan
            setLoading(false)
        }
        fetchReport()
    }, [id, getReportById])

    // Tampilkan loading jika data laporan masih dimuat
    if (loading) {
        return (
            <div className="h-screen w-screen bg-white flex items-center justify-center">
                <Loading />
                <p className="text-gray-500">Memuat laporan...</p>
            </div>
        )
    }

    // Jika laporan tidak ditemukan
    if (!currentReport) {
        return (
            <div className="h-screen w-screen bg-white flex items-center justify-center">
                <p>Laporan tidak ditemukan.</p>
            </div>
        )
    }

    return (
        <div className="w-full h-fit rounded-lg bg-white flex flex-col gap-4 px-7 py-7">
            <div className="flex flex-col">
                <h1 className="text-[#1F2937] text-2xl font-semibold">Detail Laporan</h1>
                <p className="text-[#6B7280]">Lihat detail laporan yang dikirim pelapor</p>
            </div>
            <div className="flex flex-col md:flex-row gap-5 w-full py-4">
                <Card bgColor="bg-[#F4F9F4]" padding="px-5 py-3" className="flex flex-col gap-4 flex-1" height="h-full">
                    <h1 className="font-semibold text-[#5C8D89] text-2xl">Laporan #{currentReport.id.substring(0, 8).toUpperCase()}</h1>
                    <div className="flex flex-col gap-4">
                        <Card bgColor="bg-white" className="flex flex-row gap-14" padding="py-4 px-10" overflow="overflow-visible">
                            <div className="flex flex-col md:flex-row gap-5 md:gap-10">
                                <div className="flex flex-col gap-1.5">
                                    <h3 className="text-[#5C8D89] text-base font-medium">Tanggal Melaporkan</h3>
                                    <p className="text-sm text-[#5C8D89]">
                                        {new Date(currentReport.created_at).toLocaleDateString('id-ID', {
                                            day: 'numeric',
                                            month: 'long',
                                            year: 'numeric',
                                        })}
                                    </p>
                                </div>
                                <div className="flex flex-col gap-1.5">
                                    <h3 className="text-[#5C8D89] text-base font-medium">Status Laporan</h3>
                                    <div className="flex flex-row gap-5 items-center">
                                        <StatusTag status={currentReport.status} />
                                    </div>
                                </div>
                            </div>
                        </Card>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <Card bgColor="bg-white" padding="p-5" width="w-full">
                                <h2 className="text-[#5C8D89] font-bold text-sm">Tanggal dan Waktu Kejadian</h2>
                                <div className="bg-[#A7D7C5] rounded-md flex flex-row px-4 py-2">
                                    <p className="border-r-[1px] border-[#5C8D89] pr-3">
                                        {new Date(currentReport.incident_date).toLocaleDateString('id-ID', {
                                            day: '2-digit',
                                            month: '2-digit',
                                            year: '2-digit',
                                        })}
                                    </p>
                                    <p className="pl-3">
                                        {new Date(currentReport.incident_date).toLocaleTimeString('id-ID', {
                                            hour: '2-digit',
                                            minute: '2-digit',
                                        })}
                                    </p>
                                </div>
                            </Card>
                            <Card bgColor="bg-white" padding="p-5" width="w-full">
                                <h2 className="text-[#5C8D89] font-bold text-sm">Lokasi Kejadian</h2>
                                <div className="bg-[#A7D7C5] rounded-md flex flex-row my-2 px-4 py-2">
                                    <p>
                                        {currentReport.location}
                                    </p>
                                </div>
                            </Card>
                            <Card bgColor="bg-white" padding="p-5" width="w-full">
                                <h2 className="text-[#5C8D89] font-bold text-sm">Jenis Kekerasan yang Dialami</h2>
                                <div className="bg-[#A7D7C5] rounded-md flex flex-row my-2 px-4 py-2">
                                    <p>
                                        {currentReport.title}
                                    </p>
                                </div>
                            </Card>
                            <Card bgColor="bg-white" padding="p-5" width="w-full" className="flex flex-col justify-between">
                                <h2 className="text-[#5C8D89] font-bold text-sm">Bukti Pendukung</h2>
                                {currentReport.evidence_files && currentReport.evidence_files.length > 0 ? (
                                    <div className="flex flex-row gap-3 items-center h-full">
                                        {currentReport.evidence_files.map((file: string, index: number) => (
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

                                    <div className="bg-gray-100 text-gray-500 rounded-md flex flex-row my-2 px-4 py-2">
                                        <p>
                                            Tidak ada bukti pendukung yang dilampirkan
                                        </p>
                                    </div>
                                )}
                            </Card>
                        </div>
                    </div>
                </Card>
                {/* Kronologi Section */}
                <Card bgColor="bg-[#F4F9F4]" className="flex-1 md:flex-[0.6] flex flex-col gap-4" padding="px-5 py-4">
                    <h1 className="font-semibold text-[#5C8D89] text-2xl">Kronologi Kejadian</h1>
                    <div className="bg-white rounded-md p-4 text-black text-sm overflow-y-auto max-h-[60vh]">
                        {currentReport.description || 'Tidak ada kronologi kejadian yang dilaporkan'}
                    </div>
                </Card>
            </div>
            <div className='mt-auto w-fit'>
                <FilledButton onClick={router.back} width='w-fit'>
                    Kembali
                </FilledButton>
            </div>
        </div>
    )
}