export type Database = {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          email: string
          full_name: string | null
          role: 'admin' | 'user'
          created_at: string
        }
        Insert: {
          id: string
          email: string
          full_name?: string
          role?: 'admin' | 'user'
        }
        Update: {
          email?: string
          full_name?: string
          role?: 'admin' | 'user'
        }
      }
      reports: {
        Row: {
          id: string
          reporter_id: string
          category_id: string | null
          title: string
          description: string
          location: string | null
          incident_date: string | null
          status: 'new' | 'in_progress' | 'completed' | 'rejected'
          evidence_files: string[] | null
          assigned_admin_id: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          reporter_id: string
          category_id?: string
          title: string
          description: string
          location?: string
          incident_date?: string
          evidence_files?: string[]
        }
        Update: {
          status?: 'new' | 'in_progress' | 'completed' | 'rejected'
          assigned_admin_id?: string
        }
      }
      chats: {
        Row: {
          id: string
          report_id: string
          sender_id: string
          message: string
          created_at: string
          updated_at: string
          deleted_at: string | null
          status: 'sent' | 'delivered' | 'read'
          reply_to: string | null
          attachments: string[] | null
          sender?: {
            id: string
            full_name: string
            role: string
          } | null
          reply_message?: {
            id: string
            message: string
            sender?: {
              full_name: string
            } | null
          } | null
        }
        Insert: {
          report_id: string
          sender_id: string
          message: string
          status?: 'sent' | 'delivered' | 'read'
          reply_to?: string | null
          attachments?: string[] | null
        }
        Update: {
          message?: string
          status?: 'sent' | 'delivered' | 'read'
          deleted_at?: string | null
          attachments?: string[] | null
        }
      }
      notifications: {
        Row: {
          id: string
          user_id: string
          title: string
          message: string
          type: 'report_update' | 'chat_message' | 'system'
          is_read: boolean
          reference_id: string | null
          created_at: string
        }
        Insert: {
          user_id: string
          title: string
          message: string
          type: 'report_update' | 'chat_message' | 'system'
          reference_id?: string
        }
        Update: {
          is_read?: boolean
        }
      }
    }
  }
}