export interface AuthState {
  user: UserData | null;
  session: any;
  isLoading: boolean;
  error: string | null;
  
  // Actions
  initializeAuth: () => Promise<void>;
  signOut: () => Promise<void>;
  getCurrentUser: () => Promise<UserData | null>;
  clearError: () => void;
}

export interface UserData {
  id: string;
  email: string;
  full_name: string;
  role: 'admin' | 'user';
  photo?: string;
  created_at: string;
}

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
  reporter?: {
    id: string;
    full_name: string;
    email: string;
    photo?: string;
  };
  created_at: string;
  updated_at?: string;
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