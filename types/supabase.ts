export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

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
          weight : number
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          weight: number
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          weight?: number
          updated_at?: string
          user_id?: string
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