'use client'

import { useDashboardStore } from "@/stores/dashboardStore";
import { useEffect } from "react";
import { Card } from "../common/card";
import { LaporanTablePreview } from "./table_preview_admin";

export function DashboardAdmin() {
  // Destructuring the state and actions from the store
  const { isLoading, startRealTimeUpdates, stopRealTimeUpdates, dashboardContent, fetchDashboardData} = useDashboardStore();

  useEffect(() => {
    fetchDashboardData(); // ini seharusnya memanggil data dashboard awal, tapi masih belom mudeng
    startRealTimeUpdates();

    return () => {
      stopRealTimeUpdates();
    };
  }, [startRealTimeUpdates, stopRealTimeUpdates]);

  // Jika masih loading, tampilkan loading state
  if (isLoading) {
    return <div>Loading...</div>;
  }

  const DashboardItems = dashboardContent();  // Get dashboard content from store

  return (
    <div className="flex flex-col h-auto gap-5">
      <div>
        <h1 className="text-[#1F2937] text-2xl font-semibold">Dashboard</h1>
        <p className="text-[#6B7280]">Overview data terkini</p>
      </div>
      <div className="flex flex-row gap-5 w-full">
        {DashboardItems.map(({ title, Icon, jumlah }, index) => (
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
