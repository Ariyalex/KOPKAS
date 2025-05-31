export interface UserData {
  id: string;
  email: string;
  full_name: string;
  role: 'admin' | 'user';
  photo?: string;
  created_at: string;
}

export interface Message {
  id: string;
  message: string;
  created_at: string;
  sender: {
    id: string;
    full_name: string | null;
  };
}

export interface DashboardData {
  totalReports: number;
  completedReports: number;
  totalUsers: number;
  activeChats: number;
}

export interface ReportFilters {
  searchQuery: string;
  statusFilter: string[];
  sortColumn: string;
  sortType: 'asc' | 'desc';
}

export interface FormDataType {
    category_id: string;
    incident_date: Date | null;
    location: string;
    description: string;
    evidence_files: File | null;
}

export interface FormItem {
    name: keyof FormDataType;
    title: string;
    placeholder?: string;
    type: string;
}