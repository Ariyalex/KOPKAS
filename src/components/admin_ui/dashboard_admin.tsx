import { Table, Badge } from "rsuite";
import { Card } from "../common/card";
import { CircleCheckBig, FileText, MessagesSquare, Users, ExternalLink } from "lucide-react";
import { laporanDummyData, LaporanData } from "./dummy/laporan_dummy";
import { Tag } from "../common/tag";

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
    return <div className="flex flex-col gap-5 flex-5/6 px-8 py-5 bg-[#F5FFFA]">
        <div>
            <h1 className="text-[#1F2937] text-2xl font-semibold">Dashboard</h1>
            <p className="text-[#6B7280]">Overview data terkini</p>
        </div>        <div className="flex flex-row gap-5 w-full">
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
        <Card shadow="shadow-xs" className="w-full h-full p-4">
            <h2 className="text-xl font-semibold mb-4">Laporan Masuk</h2>
            <Table
                data={laporanDummyData}
                height={340}
                hover={true}
                rowClassName={(rowData) => "hover:bg-[#F4F9F4]"}
            >
                <Column width={120} align="center" fixed>
                    <HeaderCell style={{ backgroundColor: '#E6FFFA' }}>
                        <h3 className="text-[#6B7280] font-medium text-base">ID Laporan</h3>
                    </HeaderCell>
                    <Cell dataKey="id" />
                </Column>

                <Column width={200} flexGrow={2}>
                    <HeaderCell style={{ backgroundColor: '#E6FFFA' }}>
                        <h3 className="text-[#6B7280] font-medium text-base">Pelapor</h3>
                    </HeaderCell>
                    <Cell dataKey="pelapor" />
                </Column>

                <Column width={200} flexGrow={1} >
                    <HeaderCell style={{ backgroundColor: '#E6FFFA' }}>
                        <h3 className="text-[#6B7280] font-medium text-base">Tanggal</h3>
                    </HeaderCell>
                    <Cell>
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
                    <Cell>
                        {(rowData) => {
                            const status = rowData.status;
                            let color;
                            let statusText;
                            let bgColor;

                            switch (status) {
                                case 'baru':
                                    color = 'text-blue-700';
                                    statusText = 'Baru';
                                    bgColor = "bg-blue-100";
                                    break;
                                case 'diproses':
                                    color = 'text-orange-700';
                                    statusText = 'Diproses';
                                    bgColor = "bg-orange-100";
                                    break;
                                case 'selesai':
                                    color = 'text-[#047857]';
                                    statusText = 'Selesai';
                                    bgColor = "bg-[#D1FAE5]";
                                    break;
                                case 'ditolak':
                                    color = 'text-red-700';
                                    statusText = 'Ditolak';
                                    bgColor = "bg-red-100";
                                    break;
                                default:
                                    color = 'text-gray-700';
                                    bgColor = "bg-gray-100";
                                    statusText = 'Tidak diketahui';
                            }                            return <Tag color={color as any} bgColor={bgColor as any}>
                                {statusText}
                            </Tag>;
                        }}
                    </Cell>
                </Column>
                <Column width={100} align="center" flexGrow={1}>
                    <HeaderCell style={{ backgroundColor: '#E6FFFA' }}>
                        <h3 className="text-[#6B7280] font-medium text-base">Aksi</h3>
                    </HeaderCell>
                    <Cell>
                        {() => (
                            <button

                                className="flex items-center justify-center text-green-600 hover:text-green-800 cursor-pointer"
                            >
                                <ExternalLink size={16} className="mr-1" />
                                <span>Detail</span>
                            </button>
                        )}
                    </Cell>
                </Column>
            </Table>
        </Card>
    </div>;
}
