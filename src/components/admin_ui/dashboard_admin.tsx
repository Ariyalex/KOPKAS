'use client'
import { CircleCheckBig, FileText, MessagesSquare, Users } from "lucide-react";
import { useEffect, useState } from "react";
import { Table } from "rsuite";
import { Card } from "../common/card";
import { LaporanTablePreview } from "./table_preview_admin";

// import keperluan backend
import type { Database } from "@/lib/database.types";
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

const { Column, HeaderCell, Cell } = Table;

interface DashboardItem {
    title: string;
    Icon: React.ElementType;
    jumlah: number;
}

interface DashboardData {
    totalReports: number;
    completedReports: number;
    totalUsers: number;
    activeChats: number;
}

export function DashboardAdmin() {
    const supabase = createClientComponentClient<Database>();
    const [dashboardData, setDashboardData] = useState<DashboardData>({
        totalReports: 0,
        completedReports: 0,
        totalUsers: 0,
        activeChats: 0
    });

    const DashboardContent: DashboardItem[] = [
        {
            title: "Laporan Masuk",
            Icon: FileText,
            jumlah: dashboardData.totalReports,
        },
        {
            title: "Laporan Selesai",
            Icon: CircleCheckBig,
            jumlah: dashboardData.completedReports,
        },
        {
            title: "Total Pengguna",
            Icon: Users,
            jumlah: dashboardData.totalUsers,
        },
        {
            title: "Konsultasi Aktif",
            Icon: MessagesSquare,
            jumlah: dashboardData.activeChats,
        },
    ]

    // Fetch dashboard data
    useEffect(() => {
        async function fetchDashboardData() {
            try {
                // Get total reports
                const { data: reportsData, error: reportsError } = await supabase
                    .from('reports')
                    .select('*', { count: 'exact' });

                // Get completed reports
                const { data: completedData, error: completedError } = await supabase
                    .from('reports')
                    .select('*', { count: 'exact' })
                    .eq('status', 'completed');

                // Get total users
                const { data: usersData, error: usersError } = await supabase
                    .from('users')
                    .select('*', { count: 'exact' })
                    .eq('role', 'user');

                // Get active chats
                const { data: activeData, error: activeError } = await supabase
                    .from('reports')
                    .select('*', { count: 'exact' })
                    .eq('status', 'in_progress');

                if (reportsError || completedError || usersError || activeError) {
                    throw new Error('Error fetching data');
                }

                setDashboardData({
                    totalReports: reportsData?.length || 0,
                    completedReports: completedData?.length || 0,
                    totalUsers: usersData?.length || 0,
                    activeChats: activeData?.length || 0
                });

            } catch (error) {
                console.error('Error fetching dashboard data:', error);
            }
        }

        fetchDashboardData();

        // Set up realtime subscription
        const channel = supabase
            .channel('dashboard-changes')
            .on('postgres_changes', { 
                event: '*', 
                schema: 'public', 
                table: 'reports' 
            }, () => {
                fetchDashboardData();
            })
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, [supabase]);
    
    return (
        <div className="flex flex-col h-auto gap-5">
            <div>
                <h1 className="text-[#1F2937] text-2xl font-semibold">Dashboard</h1>
                <p className="text-[#6B7280]">Overview data terkini</p>
            </div>
            <div className="flex flex-row gap-5 w-full">
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

            {/* Menggunakan komponen LaporanTablePreview untuk menampilkan pratinjau */}
            <LaporanTablePreview />
        </div>
    );
}
