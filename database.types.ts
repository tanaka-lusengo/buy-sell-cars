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
      profiles: {
        Row: {
          admin: boolean | null
          created_at: string | null
          dealership_name: string | null
          description: string | null
          email: string
          first_name: string
          government_id_path: string | null
          id: string
          is_verified: boolean | null
          last_name: string
          location: string | null
          phone: string | null
          profile_logo_path: string | null
          subscription: Database["public"]["Enums"]["subscription_type"] | null
          updated_at: string | null
          user_category:
            | Database["public"]["Enums"]["user_category_type"]
            | null
        }
        Insert: {
          admin?: boolean | null
          created_at?: string | null
          dealership_name?: string | null
          description?: string | null
          email: string
          first_name: string
          government_id_path?: string | null
          id: string
          is_verified?: boolean | null
          last_name: string
          location?: string | null
          phone?: string | null
          profile_logo_path?: string | null
          subscription?: Database["public"]["Enums"]["subscription_type"] | null
          updated_at?: string | null
          user_category?:
            | Database["public"]["Enums"]["user_category_type"]
            | null
        }
        Update: {
          admin?: boolean | null
          created_at?: string | null
          dealership_name?: string | null
          description?: string | null
          email?: string
          first_name?: string
          government_id_path?: string | null
          id?: string
          is_verified?: boolean | null
          last_name?: string
          location?: string | null
          phone?: string | null
          profile_logo_path?: string | null
          subscription?: Database["public"]["Enums"]["subscription_type"] | null
          updated_at?: string | null
          user_category?:
            | Database["public"]["Enums"]["user_category_type"]
            | null
        }
        Relationships: []
      }
      vehicle_images: {
        Row: {
          created_at: string | null
          id: string
          image_path: string
          vehicle_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          image_path: string
          vehicle_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          image_path?: string
          vehicle_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "vehicle_images_vehicle_id_fkey"
            columns: ["vehicle_id"]
            isOneToOne: false
            referencedRelation: "vehicles"
            referencedColumns: ["id"]
          },
        ]
      }
      vehicles: {
        Row: {
          condition: Database["public"]["Enums"]["condition_type"]
          created_at: string | null
          description: string | null
          doors: number | null
          fuel: Database["public"]["Enums"]["fuel_type"]
          gear_box: Database["public"]["Enums"]["gear_box_type"]
          id: string
          listing_category:
            | Database["public"]["Enums"]["listing_category_type"]
            | null
          location: string | null
          main_image_path: string | null
          make: string
          mileage: number | null
          model: string
          owner_id: string
          price: number
          seats: number | null
          spec_sheet_path: string | null
          updated_at: string | null
          vehicle_category:
            | Database["public"]["Enums"]["vehicle_category_type"]
            | null
          year: number
        }
        Insert: {
          condition: Database["public"]["Enums"]["condition_type"]
          created_at?: string | null
          description?: string | null
          doors?: number | null
          fuel: Database["public"]["Enums"]["fuel_type"]
          gear_box: Database["public"]["Enums"]["gear_box_type"]
          id?: string
          listing_category?:
            | Database["public"]["Enums"]["listing_category_type"]
            | null
          location?: string | null
          main_image_path?: string | null
          make: string
          mileage?: number | null
          model: string
          owner_id: string
          price: number
          seats?: number | null
          spec_sheet_path?: string | null
          updated_at?: string | null
          vehicle_category?:
            | Database["public"]["Enums"]["vehicle_category_type"]
            | null
          year: number
        }
        Update: {
          condition?: Database["public"]["Enums"]["condition_type"]
          created_at?: string | null
          description?: string | null
          doors?: number | null
          fuel?: Database["public"]["Enums"]["fuel_type"]
          gear_box?: Database["public"]["Enums"]["gear_box_type"]
          id?: string
          listing_category?:
            | Database["public"]["Enums"]["listing_category_type"]
            | null
          location?: string | null
          main_image_path?: string | null
          make?: string
          mileage?: number | null
          model?: string
          owner_id?: string
          price?: number
          seats?: number | null
          spec_sheet_path?: string | null
          updated_at?: string | null
          vehicle_category?:
            | Database["public"]["Enums"]["vehicle_category_type"]
            | null
          year?: number
        }
        Relationships: [
          {
            foreignKeyName: "vehicles_owner_id_fkey"
            columns: ["owner_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      condition_type: "new" | "used"
      fuel_type: "petrol" | "diesel" | "electric" | "hybrid"
      gear_box_type: "manual" | "automatic"
      listing_category_type: "rental" | "for_sale"
      subscription_type:
        | "starter_showcase"
        | "growth_accelerator"
        | "dealership_dominator"
      user_category_type: "individual" | "dealership"
      vehicle_category_type:
        | "car_rental"
        | "new_car"
        | "used_car"
        | "boat"
        | "motorcycle"
        | "truck"
        | "agriculture"
        | "earth_moving"
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
      condition_type: ["new", "used"],
      fuel_type: ["petrol", "diesel", "electric", "hybrid"],
      gear_box_type: ["manual", "automatic"],
      listing_category_type: ["rental", "for_sale"],
      subscription_type: [
        "starter_showcase",
        "growth_accelerator",
        "dealership_dominator",
      ],
      user_category_type: ["individual", "dealership"],
      vehicle_category_type: [
        "car_rental",
        "new_car",
        "used_car",
        "boat",
        "motorcycle",
        "truck",
        "agriculture",
        "earth_moving",
      ],
    },
  },
} as const
