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
      profile_views: {
        Row: {
          id: string
          profile_owner_id: string
          source_page: string | null
          viewed_at: string | null
          viewer_id: string | null
        }
        Insert: {
          id?: string
          profile_owner_id: string
          source_page?: string | null
          viewed_at?: string | null
          viewer_id?: string | null
        }
        Update: {
          id?: string
          profile_owner_id?: string
          source_page?: string | null
          viewed_at?: string | null
          viewer_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "profile_views_profile_owner_id_fkey"
            columns: ["profile_owner_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          address: string | null
          admin: boolean | null
          created_at: string | null
          dealership_name: string | null
          description: string | null
          email: string
          first_name: string
          government_id_path: string | null
          id: string
          is_feature: boolean | null
          is_verified: boolean | null
          last_name: string
          location: string | null
          phone: string | null
          profile_logo_path: string | null
          updated_at: string | null
          user_category:
            | Database["public"]["Enums"]["user_category_type"]
            | null
        }
        Insert: {
          address?: string | null
          admin?: boolean | null
          created_at?: string | null
          dealership_name?: string | null
          description?: string | null
          email: string
          first_name: string
          government_id_path?: string | null
          id: string
          is_feature?: boolean | null
          is_verified?: boolean | null
          last_name: string
          location?: string | null
          phone?: string | null
          profile_logo_path?: string | null
          updated_at?: string | null
          user_category?:
            | Database["public"]["Enums"]["user_category_type"]
            | null
        }
        Update: {
          address?: string | null
          admin?: boolean | null
          created_at?: string | null
          dealership_name?: string | null
          description?: string | null
          email?: string
          first_name?: string
          government_id_path?: string | null
          id?: string
          is_feature?: boolean | null
          is_verified?: boolean | null
          last_name?: string
          location?: string | null
          phone?: string | null
          profile_logo_path?: string | null
          updated_at?: string | null
          user_category?:
            | Database["public"]["Enums"]["user_category_type"]
            | null
        }
        Relationships: []
      }
      subscribers: {
        Row: {
          confirmed: boolean | null
          email: string
          id: string
          source: Database["public"]["Enums"]["subscriber_source_type"] | null
          subscribed_at: string | null
          unsubscribed_at: string | null
        }
        Insert: {
          confirmed?: boolean | null
          email: string
          id?: string
          source?: Database["public"]["Enums"]["subscriber_source_type"] | null
          subscribed_at?: string | null
          unsubscribed_at?: string | null
        }
        Update: {
          confirmed?: boolean | null
          email?: string
          id?: string
          source?: Database["public"]["Enums"]["subscriber_source_type"] | null
          subscribed_at?: string | null
          unsubscribed_at?: string | null
        }
        Relationships: []
      }
      subscriptions: {
        Row: {
          cancel_time: string | null
          created_at: string | null
          customer_code: string | null
          email: string | null
          id: string
          plan_code: string | null
          profile_id: string
          raw_response: Json | null
          start_time: string | null
          status: string | null
          subscription_code: string | null
          subscription_name: string | null
          updated_at: string | null
        }
        Insert: {
          cancel_time?: string | null
          created_at?: string | null
          customer_code?: string | null
          email?: string | null
          id?: string
          plan_code?: string | null
          profile_id: string
          raw_response?: Json | null
          start_time?: string | null
          status?: string | null
          subscription_code?: string | null
          subscription_name?: string | null
          updated_at?: string | null
        }
        Update: {
          cancel_time?: string | null
          created_at?: string | null
          customer_code?: string | null
          email?: string | null
          id?: string
          plan_code?: string | null
          profile_id?: string
          raw_response?: Json | null
          start_time?: string | null
          status?: string | null
          subscription_code?: string | null
          subscription_name?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "subscriptions_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: true
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      vehicle_ad_clicks: {
        Row: {
          clicked_at: string | null
          id: string
          source_page: string | null
          vehicle_id: string
          vehicle_owner_id: string | null
          viewer_id: string | null
        }
        Insert: {
          clicked_at?: string | null
          id?: string
          source_page?: string | null
          vehicle_id: string
          vehicle_owner_id?: string | null
          viewer_id?: string | null
        }
        Update: {
          clicked_at?: string | null
          id?: string
          source_page?: string | null
          vehicle_id?: string
          vehicle_owner_id?: string | null
          viewer_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "vehicle_ad_clicks_vehicle_id_fkey"
            columns: ["vehicle_id"]
            isOneToOne: false
            referencedRelation: "vehicles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "vehicle_ad_clicks_vehicle_owner_id_fkey"
            columns: ["vehicle_owner_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      vehicle_favourites: {
        Row: {
          favourited_at: string | null
          id: string
          profile_id: string
          vehicle_id: string
        }
        Insert: {
          favourited_at?: string | null
          id?: string
          profile_id: string
          vehicle_id: string
        }
        Update: {
          favourited_at?: string | null
          id?: string
          profile_id?: string
          vehicle_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "vehicle_favourites_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "vehicle_favourites_vehicle_id_fkey"
            columns: ["vehicle_id"]
            isOneToOne: false
            referencedRelation: "vehicles"
            referencedColumns: ["id"]
          },
        ]
      }
      vehicle_images: {
        Row: {
          created_at: string | null
          id: string
          image_path: string
          updated_at: string | null
          vehicle_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          image_path: string
          updated_at?: string | null
          vehicle_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          image_path?: string
          updated_at?: string | null
          vehicle_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "fk_vehicle"
            columns: ["vehicle_id"]
            isOneToOne: false
            referencedRelation: "vehicles"
            referencedColumns: ["id"]
          },
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
          is_active: boolean | null
          is_feature: boolean | null
          listing_category: Database["public"]["Enums"]["listing_category_type"]
          location: string | null
          make: string
          mileage: number | null
          model: string
          owner_id: string
          price: number
          seats: number | null
          spec_sheet_path: string | null
          updated_at: string | null
          vehicle_category: Database["public"]["Enums"]["vehicle_category_type"]
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
          is_active?: boolean | null
          is_feature?: boolean | null
          listing_category: Database["public"]["Enums"]["listing_category_type"]
          location?: string | null
          make: string
          mileage?: number | null
          model: string
          owner_id: string
          price: number
          seats?: number | null
          spec_sheet_path?: string | null
          updated_at?: string | null
          vehicle_category: Database["public"]["Enums"]["vehicle_category_type"]
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
          is_active?: boolean | null
          is_feature?: boolean | null
          listing_category?: Database["public"]["Enums"]["listing_category_type"]
          location?: string | null
          make?: string
          mileage?: number | null
          model?: string
          owner_id?: string
          price?: number
          seats?: number | null
          spec_sheet_path?: string | null
          updated_at?: string | null
          vehicle_category?: Database["public"]["Enums"]["vehicle_category_type"]
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
      is_admin: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
    }
    Enums: {
      condition_type: "new" | "used"
      fuel_type: "petrol" | "diesel" | "electric" | "hybrid"
      gear_box_type: "manual" | "automatic"
      listing_category_type: "for_sale" | "rental"
      subscriber_source_type:
        | "landing_page_footer"
        | "email"
        | "landing_page_pop_up"
      user_category_type: "individual" | "dealership" | "guest"
      vehicle_category_type:
        | "boat"
        | "bike"
        | "car"
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
      listing_category_type: ["for_sale", "rental"],
      subscriber_source_type: [
        "landing_page_footer",
        "email",
        "landing_page_pop_up",
      ],
      user_category_type: ["individual", "dealership", "guest"],
      vehicle_category_type: [
        "boat",
        "bike",
        "car",
        "truck",
        "agriculture",
        "earth_moving",
      ],
    },
  },
} as const
