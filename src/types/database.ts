export type Database = {
  public: {
    Tables: {
      admin_users: {
        Row: {
          id: string
          email: string
          name: string
          role: 'super_admin' | 'admin'
          is_active: boolean
          created_at: string
          updated_at: string
          last_login: string | null
        }
        Insert: {
          id?: string
          email: string
          name: string
          role?: 'super_admin' | 'admin'
          is_active?: boolean
          created_at?: string
          updated_at?: string
          last_login?: string | null
        }
        Update: {
          id?: string
          email?: string
          name?: string
          role?: 'super_admin' | 'admin'
          is_active?: boolean
          created_at?: string
          updated_at?: string
          last_login?: string | null
        }
      }
      online_classes: {
        Row: {
          id: string
          reference_id: string
          program_name: string
          instructor_name: string
          instructor_email: string
          class_date: string
          class_time: string
          class_title: string
          class_description: string
          teams_recording_url: string
          duration_minutes: number
          recording_size_mb: number
          status: 'submitted' | 'reviewed' | 'approved' | 'archived'
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          reference_id?: string
          program_name: string
          instructor_name: string
          instructor_email: string
          class_date: string
          class_time: string
          class_title: string
          class_description: string
          teams_recording_url: string
          duration_minutes: number
          recording_size_mb: number
          status?: 'submitted' | 'reviewed' | 'approved' | 'archived'
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          reference_id?: string
          program_name?: string
          instructor_name?: string
          instructor_email?: string
          class_date?: string
          class_time?: string
          class_title?: string
          class_description?: string
          teams_recording_url?: string
          duration_minutes?: number
          recording_size_mb?: number
          status?: 'submitted' | 'reviewed' | 'approved' | 'archived'
          created_at?: string
          updated_at?: string
        }
      }
      audit_logs: {
        Row: {
          id: string
          action: string
          table_name: string
          record_id: string
          user_id: string | null
          old_values: Record<string, unknown> | null
          new_values: Record<string, unknown> | null
          created_at: string
        }
        Insert: {
          id?: string
          action: string
          table_name: string
          record_id: string
          user_id?: string | null
          old_values?: Record<string, unknown> | null
          new_values?: Record<string, unknown> | null
          created_at?: string
        }
        Update: {
          id?: string
          action?: string
          table_name?: string
          record_id?: string
          user_id?: string | null
          old_values?: Record<string, unknown> | null
          new_values?: Record<string, unknown> | null
          created_at?: string
        }
      }
      reference_counters: {
        Row: {
          id: string
          counter_key: string
          current_value: number
          last_reset: string
          created_at: string
        }
        Insert: {
          id?: string
          counter_key: string
          current_value?: number
          last_reset?: string
          created_at?: string
        }
        Update: {
          id?: string
          counter_key?: string
          current_value?: number
          last_reset?: string
          created_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      submit_online_class: {
        Args: {
          p_program_name: string
          p_instructor_name: string
          p_instructor_email: string
          p_class_date: string
          p_class_time: string
          p_class_title: string
          p_class_description: string
          p_teams_recording_url: string
          p_duration_minutes: number
          p_recording_size_mb: number
        }
        Returns: {
          reference_id: string
          id: string
        }
      }
      get_next_reference_id: {
        Args: Record<string, never>
        Returns: string
      }
      is_admin: {
        Args: {
          p_user_id: string
        }
        Returns: boolean
      }
      update_admin_last_login: {
        Args: {
          p_user_id: string
        }
        Returns: Record<string, unknown>
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}
