'use client'

import { Card } from "../common/card";
import { StatusTag } from "../common/tag";
import { ReportContentDummy } from "./dummy/reports_dummy";
import { ExternalLink } from "lucide-react";
import { useRouter } from "next/navigation";

export function ReportListUser() {
    const reports = ReportContentDummy;
    const router = useRouter();

    return (
        <Card className="flex flex-5/6 gap-2 py-5 flex-col" height="h-full">
            <div>
                <h1 className="text-[#1F2937] text-2xl font-semibold">Daftar Laporan</h1>
                <p className="text-[#6B7280]">Daftar laporan yang sudah dikirim</p>
            </div>
            <div className="flex flex-col overflow-y-scroll h-full pr-4">
                {reports.map((report) => (
                    <div key={report.id} className="flex flex-col">
                        <div className="flex flex-row justify-between">
                            <div className="flex flex-col">
                                <h3 className="text-[#5C8D89] font-medium text-lg">Report <span>{report.id}</span></h3>
                                <p>Dilaporkan pada {new Date(report.created_at).toLocaleDateString()}</p>
                            </div>
                            <div className="flex flex-col justify-between items-center">
                                <StatusTag status={report.status} />
                                <button
                                    onClick={() => {
                                        router.push(`/user/report/${report.id}`)
                                    }}
                                    className="flex items-center justify-center text-green-600 hover:text-green-800 cursor-pointer"
                                >
                                    <ExternalLink size={16} className="mr-1" />
                                    <span>Detail</span>
                                </button>
                            </div>
                        </div>
                        <div className="w-full h-[1.5px] bg-[#E5E7EB] my-4" />
                    </div>
                ))}
            </div>
        </Card>
    )
}