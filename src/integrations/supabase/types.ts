export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      bookings: {
        Row: {
          amount: number
          booking_date: string
          created_at: string
          customer_email: string
          customer_name: string
          id: string
          service_type: string
          status: string
          updated_at: string
          worker_id: string | null
        }
        Insert: {
          amount: number
          booking_date: string
          created_at?: string
          customer_email: string
          customer_name: string
          id?: string
          service_type: string
          status?: string
          updated_at?: string
          worker_id?: string | null
        }
        Update: {
          amount?: number
          booking_date?: string
          created_at?: string
          customer_email?: string
          customer_name?: string
          id?: string
          service_type?: string
          status?: string
          updated_at?: string
          worker_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "bookings_worker_id_fkey"
            columns: ["worker_id"]
            isOneToOne: false
            referencedRelation: "workers"
            referencedColumns: ["id"]
          },
        ]
      }
      workers: {
        Row: {
          about: string | null
          address: string | null
          approval_date: string | null
          availability: string | null
          category: Database["public"]["Enums"]["worker_category"]
          city: string | null
          created_at: string
          date_of_birth: string | null
          email: string
          experience: string | null
          gender: string | null
          id: string
          id_number: string | null
          id_proof_url: string | null
          id_type: string | null
          name: string
          phone: string | null
          profile_image_url: string | null
          ratings: number | null
          skills: string[] | null
          status: Database["public"]["Enums"]["worker_status"]
          total_bookings: number | null
          updated_at: string
        }
        Insert: {
          about?: string | null
          address?: string | null
          approval_date?: string | null
          availability?: string | null
          category: Database["public"]["Enums"]["worker_category"]
          city?: string | null
          created_at?: string
          date_of_birth?: string | null
          email: string
          experience?: string | null
          gender?: string | null
          id?: string
          id_number?: string | null
          id_proof_url?: string | null
          id_type?: string | null
          name: string
          phone?: string | null
          profile_image_url?: string | null
          ratings?: number | null
          skills?: string[] | null
          status?: Database["public"]["Enums"]["worker_status"]
          total_bookings?: number | null
          updated_at?: string
        }
        Update: {
          about?: string | null
          address?: string | null
          approval_date?: string | null
          availability?: string | null
          category?: Database["public"]["Enums"]["worker_category"]
          city?: string | null
          created_at?: string
          date_of_birth?: string | null
          email?: string
          experience?: string | null
          gender?: string | null
          id?: string
          id_number?: string | null
          id_proof_url?: string | null
          id_type?: string | null
          name?: string
          phone?: string | null
          profile_image_url?: string | null
          ratings?: number | null
          skills?: string[] | null
          status?: Database["public"]["Enums"]["worker_status"]
          total_bookings?: number | null
          updated_at?: string
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
      worker_category:
        | "Cook"
        | "Cleaner"
        | "Sweeper"
        | "Driver"
        | "Gardener"
        | "Other"
      worker_status: "Pending" | "Verified" | "Rejected" | "Active" | "Inactive"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      worker_category: [
        "Cook",
        "Cleaner",
        "Sweeper",
        "Driver",
        "Gardener",
        "Other",
      ],
      worker_status: ["Pending", "Verified", "Rejected", "Active", "Inactive"],
    },
  },
} as const
