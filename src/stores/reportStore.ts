import type { Database } from '@/lib/database.types';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { create } from 'zustand';
import type { ReportFilters } from '../types';

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
  reporter?: {
    id: string;
    full_name: string;
    email: string;
    photo?: string;
  };
  created_at: string;
  updated_at?: string;
}


interface ReportState {
  reports: Report[];
  currentReport: Report | null;
  recentReports: Report[];
  isLoading: boolean;
  error: string | null;
  filters: ReportFilters;

  fetchReports: (userId?: string) => Promise<void>;
  fetchReportById: (id: string) => Promise<void>;
  fetchRecentReports: (limit?: number) => Promise<void>;
  updateReportStatus: (reportId: string, newStatus: Report['status'], notes?: string) => Promise<void>;
  createReport: (reportData: Partial<Report>) => Promise<string>;
  setFilters: (filters: Partial<ReportFilters>) => void;
  resetFilters: () => void;
  clearError: () => void;
}

const defaultFilters: ReportFilters = {
  searchQuery: '',
  statusFilter: [],
  sortColumn: 'created_at',
  sortType: 'desc'
};

export const useReportStore = create<ReportState>((set, get) => ({
  reports: [],
  currentReport: null,
  recentReports: [],
  isLoading: false,
  error: null,
  filters: defaultFilters,

  // Fetch reports with filtering, search, and sorting
  fetchReports: async (userId?: string) => {
    set({ isLoading: true });
    try {
      const supabase = createClientComponentClient<Database>();
      const { filters } = get();

      let query = supabase.from('reports').select(`
        id,
        title,
        description,
        location,
        incident_date,
        status,
        evidence_files,
        category_id,
        reporter_id,
        created_at,
        updated_at,
        reporter:users!reports_reporter_id_fkey (
          id,
          full_name,
          email,
          photo
        )
      `);

      // Apply user ID filter if provided
      if (userId) {
        query = query.eq('reporter_id', userId);
      }

      // Apply search filter
      if (filters.searchQuery.trim()) {
        query = query.or(`id.ilike.%${filters.searchQuery}%,reporter.full_name.ilike.%${filters.searchQuery}%`);
      }

      // Apply status filters
      if (filters.statusFilter.length > 0) {
        query = query.in('status', filters.statusFilter);
      }

      // Apply sorting
        query = query.order('created_at', { ascending: false }).limit(5);

      const { data, error } = await query;

      if (error) throw error;

      set({ reports: data as unknown as Report[], error: null });

    } catch (error: any) {
      set({ error: error.message });
    } finally {
      set({ isLoading: false });
    }
  },

  // Fetch a single report by its ID
  fetchReportById: async (id: string) => {
    set({ isLoading: true });
    try {
      const supabase = createClientComponentClient<Database>();

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
        .eq('id', id)
        .single();

      if (error) throw error;

      set({ currentReport: data as Report, error: null });

    } catch (error: any) {
      set({ error: error.message });
    } finally {
      set({ isLoading: false });
    }
  },

  // Fetch recent reports
  fetchRecentReports: async (limit = 5) => {
    try {
      const supabase = createClientComponentClient<Database>();

      const { data, error } = await supabase
        .from('reports')
        .select(`
          id,
          title,
          status,
          created_at,
          reporter:users!reports_reporter_id_fkey (
            id,
            full_name
          )
        `)
        .order('created_at', { ascending: false })
        .limit(limit);

      if (error) throw error;

      set({ recentReports: data as unknown as Report[] });

    } catch (error: any) {
      console.error('Error fetching recent reports:', error);
    }
  },

  // Update the status of a report
  updateReportStatus: async (reportId: string, newStatus: Report['status'], notes?: string) => {
    set({ isLoading: true });
    try {
      const supabase = createClientComponentClient<Database>();
      const { currentReport } = get();

      if (!currentReport) throw new Error('No current report');

      // Update report status
      const { error: updateError } = await supabase
        .from('reports')
        .update({
          status: newStatus,
          updated_at: new Date().toISOString()
        })
        .eq('id', reportId);

      if (updateError) throw updateError;

      // Create report update record
      await supabase.from('report_updates').insert({
        report_id: reportId,
        old_status: currentReport.status,
        new_status: newStatus,
        notes: notes || `Status diperbarui ke ${newStatus}`
      });

      // Update local state
      set({
        currentReport: { ...currentReport, status: newStatus },
        error: null
      });

      // Refresh reports list
      get().fetchReports();

    } catch (error: any) {
      set({ error: error.message });
    } finally {
      set({ isLoading: false });
    }
  },

  // Create a new report
  createReport: async (reportData: Partial<Report>) => {
    set({ isLoading: true });
    try {
      const supabase = createClientComponentClient<Database>();

      const generateReportId = (): string => {
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        let id = 'R';
        for (let i = 0; i < 4; i++) {
          id += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return id;
      };

      const reportId = generateReportId();

      const { data, error } = await supabase
        .from('reports')
        .insert({
          id: reportId,
          ...reportData,
          status: 'new'
        })
        .select()
        .single();

      if (error) throw error;

      set({ error: null });
      return reportId;

    } catch (error: any) {
      set({ error: error.message });
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },

  // Set the filters
  setFilters: (newFilters: Partial<ReportFilters>) => {
    set(state => ({
      filters: { ...state.filters, ...newFilters }
    }));
  },

  // Reset the filters to default
  resetFilters: () => {
    set({ filters: defaultFilters });
  },

  // Clear the error state
  clearError: () => set({ error: null })
}));
