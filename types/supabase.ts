import { Database as SupabaseDatabase } from '@/supabase';

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type WeightLog = SupabaseDatabase['public']['Tables']['userHealthLog']['Row'];
export type Profile = SupabaseDatabase['public']['Tables']['profile']['Row'];
export type Group = SupabaseDatabase['public']['Tables']['groups']['Row'];
export type GroupMember = SupabaseDatabase['public']['Tables']['groupMembers']['Row'];

// Create a SupabaseContext type
export type SupabaseContextType = {
  supabase: any;
  session: any;
};

export type Database = {
  graphql_public: {
    Tables: {
      [_ in never]: never
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      graphql: {
        Args: {
          operationName?: string
          query?: string
          variables?: Json
          extensions?: Json
        }
        Returns: Json
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
  public: {
    Tables: {
      groupMembers: {
        Row: {
          created_at: string
          group_id: string | null
          id: number
          user_id: string | null
        }
        Insert: {
          created_at?: string
          group_id?: string | null
          id?: number
          user_id?: string | null
        }
        Update: {
          created_at?: string
          group_id?: string | null
          id?: number
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "groupMembers_group_fkey"
            columns: ["group_id"]
            isOneToOne: false
            referencedRelation: "groups"
            referencedColumns: ["id"]
          },
        ]
      }
      groups: {
        Row: {
          created_at: string
          created_by: string
          description: string | null
          id: string
          title: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          created_by: string
          description?: string | null
          id?: string
          title: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          created_by?: string
          description?: string | null
          id?: string
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      profile: {
        Row: {
          avatar_url: string | null
          created_at: string
          full_name: string
          height: number
          id: string
          updated_at: string
          weight: number
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          full_name: string
          height: number
          id: string
          updated_at?: string
          weight: number
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          full_name?: string
          height?: number
          id?: string
          updated_at?: string
          weight?: number
        }
        Relationships: []
      }
      userHealthLog: {
        Row: {
          created_at: string
          id: string
          log_date: string | null
          steps: number | null
          updated_at: string
          user_id: string
          weight: number
        }
        Insert: {
          created_at?: string
          id?: string
          log_date?: string | null
          steps?: number | null
          updated_at?: string
          user_id: string
          weight: number
        }
        Update: {
          created_at?: string
          id?: string
          log_date?: string | null
          steps?: number | null
          updated_at?: string
          user_id?: string
          weight?: number
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
} 