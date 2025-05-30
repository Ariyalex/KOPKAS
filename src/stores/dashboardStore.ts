import type { Database } from '@/lib/database.types';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { CircleCheckBig, FileText, MessagesSquare, Users } from 'lucide-react';
import { create } from 'zustand';
import type { DashboardData } from '../types';

interface DashboardState {
  dashboardData: DashboardData;
  isLoading: boolean;
  error: string | null;
  subscription: any;

  // Actions
  fetchDashboardData: () => Promise<void>;
  startRealTimeUpdates: () => void;
  stopRealTimeUpdates: () => void;
  clearError: () => void;

  // Computed values for dashboard content
  dashboardContent: () => DashboardItem[];
}

interface DashboardItem {
  title: string;
  Icon: React.ElementType;
  jumlah: number;
}

export const useDashboardStore = create<DashboardState>((set, get) => ({
  dashboardData: {
    totalReports: 0,
    completedReports: 0,
    totalUsers: 0,
    activeChats: 0,
  },
  isLoading: false,
  error: null,
  subscription: null,

  fetchDashboardData: async () => {
    set({ isLoading: true });
    try {
      const supabase = createClientComponentClient<Database>();

      // Parallel fetch untuk performa yang lebih baik
      const [
        { data: reportsData, error: reportsError },
        { data: completedData, error: completedError },
        { data: usersData, error: usersError },
        { data: activeData, error: activeError }
      ] = await Promise.all([
        supabase.from('reports').select('*', { count: 'exact' }),
        supabase.from('reports').select('*', { count: 'exact' }).eq('status', 'completed'),
        supabase.from('users').select('*', { count: 'exact' }).eq('role', 'user'),
        supabase.from('reports').select('*', { count: 'exact' }).eq('status', 'in_progress')
      ]);

      if (reportsError || completedError || usersError || activeError) {
        throw new Error('Error fetching dashboard data');
      }

      set({
        dashboardData: {
          totalReports: reportsData?.length || 0,
          completedReports: completedData?.length || 0,
          totalUsers: usersData?.length || 0,
          activeChats: activeData?.length || 0,
        },
        error: null,
      });
    } catch (error: any) {
      set({ error: error.message });
    } finally {
      set({ isLoading: false });
    }
  },

  startRealTimeUpdates: () => {
    const supabase = createClientComponentClient<Database>();

    const channel = supabase
      .channel('dashboard-changes')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'reports',
      }, () => {
        get().fetchDashboardData();
      })
      .subscribe();

    set({ subscription: channel });
  },

  stopRealTimeUpdates: () => {
    const { subscription } = get();
    if (subscription) {
      const supabase = createClientComponentClient<Database>();
      supabase.removeChannel(subscription);
      set({ subscription: null });
    }
  },

  clearError: () => set({ error: null }),

  // New computed value for Dashboard content
  dashboardContent: () => {
    const { totalReports, completedReports, totalUsers, activeChats } = get().dashboardData;

    return [
      {
        title: "Laporan Masuk",
        Icon: FileText,
        jumlah: totalReports,
      },
      {
        title: "Laporan Selesai",
        Icon: CircleCheckBig,
        jumlah: completedReports,
      },
      {
        title: "Total Pengguna",
        Icon: Users,
        jumlah: totalUsers,
      },
      {
        title: "Konsultasi Aktif",
        Icon: MessagesSquare,
        jumlah: activeChats,
      },
    ];
  },
}));
