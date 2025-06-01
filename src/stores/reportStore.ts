import type { Database } from '@/lib/database.types';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { create } from 'zustand';

export interface Report {
  id: string;
  title: string;
  description: string;
  location: string;
  incident_date: string;
  status: 'new' | 'in_progress' | 'completed' | 'rejected';
  evidence_files: string[] | null;
  category_id: string;
  reporter_id: string;
  reporter_full_name: string;
  reporter_email: string;
  reporter_photo?: string;
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

export interface ReportFilters {
  searchQuery: string;
  statusFilter: string[];
  sortColumn: string;
  sortType: 'asc' | 'desc';
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
      `);      // Apply user ID filter if provided
      if (userId) {
        query = query.eq('reporter_id', userId);
      }      // Apply search filter
      if (filters.searchQuery.trim()) {
        const searchTerm = `%${filters.searchQuery}%`;

        console.log("Searching for:", filters.searchQuery);        // Dua pendekatan pencarian: 1) Langsung di tabel reports, 2) Via relasi user

        // Pendekatan 1: Pencarian langsung di kolom tabel reports
        // Buat query baru alih-alih clone
        let directSearchQuery = supabase.from('reports').select(`
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

        // Tambahkan kembali filter user ID jika ada
        if (userId) {
          directSearchQuery = directSearchQuery.eq('reporter_id', userId);
        }

        // Tambahkan pencarian OR untuk kolom-kolom langsung
        directSearchQuery = directSearchQuery.or(
          `id.ilike.${searchTerm},title.ilike.${searchTerm},description.ilike.${searchTerm},location.ilike.${searchTerm}`
        );

        // Pendekatan 2: Pencarian terpisah untuk nama pelapor di tabel users
        const { data: userMatches, error: userError } = await supabase
          .from('users')
          .select('id')
          .ilike('full_name', `%${filters.searchQuery}%`);

        // Jika ditemukan user yang cocok, buat query untuk mencari berdasarkan reporter_id
        // Buat query baru alih-alih clone
        let userBasedSearchQuery = null;
        if (!userError && userMatches && userMatches.length > 0) {
          const userIds = userMatches.map(user => user.id);

          // Log untuk debugging
          console.log("Found user IDs for name search:", userIds);

          // Buat query baru untuk pencarian berdasarkan reporter_id
          userBasedSearchQuery = supabase.from('reports').select(`
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

          // Tambahkan kembali filter user ID jika ada
          if (userId) {
            userBasedSearchQuery = userBasedSearchQuery.eq('reporter_id', userId);
          }

          // Gunakan query terpisah untuk mencari berdasarkan reporter_id
          userBasedSearchQuery = userBasedSearchQuery.in('reporter_id', userIds);
        } else {
          console.log("No users found with name:", filters.searchQuery);
          // Jika tidak ada user yang cocok, set userBasedSearchQuery = null
          userBasedSearchQuery = null;
        }

        // Gabungkan hasil kedua pendekatan jika kedua query valid
        if (userBasedSearchQuery) {
          // Ambil data dari kedua query
          const [directResults, userBasedResults] = await Promise.all([
            directSearchQuery,
            userBasedSearchQuery
          ]);          // Gabungkan hasil kedua query dan hapus duplikasi
          const directData = directResults.data || [];
          const userBasedData = userBasedResults.data || [];

          console.log("Direct search results:", directData.length);
          console.log("User-based search results:", userBasedData.length);

          // Gabungkan data dan hapus duplikasi
          const allIds = new Set<string>();
          const combinedData = [...directData];

          directData.forEach((item: any) => allIds.add(item.id));

          userBasedData.forEach((item: any) => {
            if (!allIds.has(item.id)) {
              combinedData.push(item);
              allIds.add(item.id);
            }
          });

          console.log("Combined results:", combinedData.length);

          // PERBAIKAN: Jangan mencoba mengganti objek query itu sendiri
          // Namun simpan data langsung untuk dikembalikan
          // Set data hasil pencarian
          const { error } = directResults;
          if (error) throw error;          // Simpan data gabungan sebagai variabel
          const tempData = combinedData;

          // PERBAIKAN: Ubah formatnya sama seperti transformasi yang ada di bagian akhir fungsi
          const transformedResults = tempData.map(item => {
            // Get the reporter data - access the first element if it's an array
            const reporterData = Array.isArray(item.reporter) ? item.reporter[0] : item.reporter;

            return {
              id: item.id,
              title: item.title,
              description: item.description,
              location: item.location,
              incident_date: item.incident_date,
              status: item.status,
              evidence_files: item.evidence_files,
              category_id: item.category_id,
              reporter_id: item.reporter_id,
              reporter_full_name: reporterData?.full_name || '',
              reporter_email: reporterData?.email || '',
              reporter_photo: reporterData?.photo,
              created_at: item.created_at,
              updated_at: item.updated_at
            };
          });

          // PERBAIKAN: Set hasil ke reports daripada return
          set({ reports: transformedResults, error: null });
          return;
        } else {
          // Jika hanya ada pencarian langsung, gunakan itu saja
          query = directSearchQuery;
        }
      }

      // Apply status filters
      if (filters.statusFilter.length > 0) {
        query = query.in('status', filters.statusFilter);
      }

      // Apply sorting with special case for reporter_full_name
      if (filters.sortColumn === 'reporter_full_name') {
        // Sort by the full_name in the reporter relation
        query = query.order('reporter(full_name)', { ascending: filters.sortType === 'asc' });
      } else {
        // Regular column sorting
        query = query.order(filters.sortColumn, { ascending: filters.sortType === 'asc' });
      }      // Log untuk debugging query final yang dijalankan
      console.log("Final query:", query);

      const { data, error } = await query;

      if (error) {
        console.error("Query error:", error);
        throw error;
      }

      console.log("Query result:", data && data.length ? data.length : 0, "reports found");
      if (data && data.length > 0 && data[0].reporter) {
        console.log("Reporter data format check:",
          Array.isArray(data[0].reporter) ? "Array" : "Object",
          data[0].reporter);
      }

      const transformedData = data?.map(item => {
        // Get the reporter data - access the first element if it's an array
        const reporterData = Array.isArray(item.reporter) ? item.reporter[0] : item.reporter;

        return {
          id: item.id,
          title: item.title,
          description: item.description,
          location: item.location,
          incident_date: item.incident_date,
          status: item.status,
          evidence_files: item.evidence_files,
          category_id: item.category_id,
          reporter_id: item.reporter_id,
          reporter_full_name: reporterData?.full_name || '',
          reporter_email: reporterData?.email || '',
          reporter_photo: reporterData?.photo,
          created_at: item.created_at,
          updated_at: item.updated_at
        };
      }) || [];

      set({ reports: transformedData, error: null });

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
        `)
        .eq('id', id)
        .single();

      if (error) throw error;

      // Transform the data to match the Report interface
      const reporterData = Array.isArray(data.reporter) ? data.reporter[0] : data.reporter;

      const transformedReport: Report = {
        id: data.id,
        title: data.title,
        description: data.description,
        location: data.location,
        incident_date: data.incident_date,
        status: data.status,
        evidence_files: data.evidence_files,
        category_id: data.category_id,
        reporter_id: data.reporter_id,
        reporter_full_name: reporterData?.full_name || '',
        reporter_email: reporterData?.email || '',
        reporter_photo: reporterData?.photo,
        created_at: data.created_at,
        updated_at: data.updated_at
      };

      set({ currentReport: transformedReport, error: null });

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

      // Transform the data to match the Report interface
      const transformedData = data?.map(item => {
        // Get the reporter data - access the first element if it's an array
        const reporterData = Array.isArray(item.reporter) ? item.reporter[0] : item.reporter;

        return {
          id: item.id,
          title: item.title,
          description: '', // Default value for missing fields
          location: '',
          incident_date: '',
          status: item.status,
          evidence_files: null,
          category_id: '',
          reporter_id: reporterData?.id || '',
          reporter_full_name: reporterData?.full_name || '',
          reporter_email: '',
          created_at: item.created_at,
          updated_at: undefined
        } as Report;
      }) || [];

      set({ recentReports: transformedData });

    } catch (error: any) {
      console.error('Error fetching recent reports:', error);
      // Consider updating the error state here
      // set({ error: error.message });
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
