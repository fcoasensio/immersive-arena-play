export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      configuracion: {
        Row: {
          clave: string
          descripcion: string | null
          id: string
          updated_at: string
          valor: Json
        }
        Insert: {
          clave: string
          descripcion?: string | null
          id?: string
          updated_at?: string
          valor: Json
        }
        Update: {
          clave?: string
          descripcion?: string | null
          id?: string
          updated_at?: string
          valor?: Json
        }
        Relationships: []
      }
      festivos: {
        Row: {
          created_at: string
          fecha: string
          id: string
          nombre: string
        }
        Insert: {
          created_at?: string
          fecha: string
          id?: string
          nombre?: string
        }
        Update: {
          created_at?: string
          fecha?: string
          id?: string
          nombre?: string
        }
        Relationships: []
      }
      packs: {
        Row: {
          activo: boolean
          caracteristicas: Json
          color: string
          created_at: string
          descripcion: string
          duracion: string
          icono: string
          id: string
          jugadores: string
          nombre: string
          orden: number
          popular: boolean
          precio: string
          updated_at: string
        }
        Insert: {
          activo?: boolean
          caracteristicas?: Json
          color?: string
          created_at?: string
          descripcion?: string
          duracion?: string
          icono?: string
          id?: string
          jugadores?: string
          nombre: string
          orden?: number
          popular?: boolean
          precio?: string
          updated_at?: string
        }
        Update: {
          activo?: boolean
          caracteristicas?: Json
          color?: string
          created_at?: string
          descripcion?: string
          duracion?: string
          icono?: string
          id?: string
          jugadores?: string
          nombre?: string
          orden?: number
          popular?: boolean
          precio?: string
          updated_at?: string
        }
        Relationships: []
      }
      reservas: {
        Row: {
          actividad: Database["public"]["Enums"]["actividad"]
          anticipo: number | null
          codigo_postal: string
          created_at: string
          direccion: string
          dni_cif: string
          duracion: Database["public"]["Enums"]["duracion_reserva"]
          edad_menor: number | null
          email: string
          estado: Database["public"]["Enums"]["estado_reserva"]
          fecha: string
          google_calendar_event_id: string | null
          hora: string
          id: string
          nombre_completo: string
          nombre_menor: string | null
          notas: string | null
          num_participantes: number
          precio_base: number | null
          precio_final: number | null
          telefono: string
          tematica_invitacion: string | null
          tipo_reserva: Database["public"]["Enums"]["tipo_reserva"]
        }
        Insert: {
          actividad: Database["public"]["Enums"]["actividad"]
          anticipo?: number | null
          codigo_postal: string
          created_at?: string
          direccion: string
          dni_cif: string
          duracion?: Database["public"]["Enums"]["duracion_reserva"]
          edad_menor?: number | null
          email: string
          estado?: Database["public"]["Enums"]["estado_reserva"]
          fecha: string
          google_calendar_event_id?: string | null
          hora: string
          id?: string
          nombre_completo: string
          nombre_menor?: string | null
          notas?: string | null
          num_participantes: number
          precio_base?: number | null
          precio_final?: number | null
          telefono: string
          tematica_invitacion?: string | null
          tipo_reserva: Database["public"]["Enums"]["tipo_reserva"]
        }
        Update: {
          actividad?: Database["public"]["Enums"]["actividad"]
          anticipo?: number | null
          codigo_postal?: string
          created_at?: string
          direccion?: string
          dni_cif?: string
          duracion?: Database["public"]["Enums"]["duracion_reserva"]
          edad_menor?: number | null
          email?: string
          estado?: Database["public"]["Enums"]["estado_reserva"]
          fecha?: string
          google_calendar_event_id?: string | null
          hora?: string
          id?: string
          nombre_completo?: string
          nombre_menor?: string | null
          notas?: string | null
          num_participantes?: number
          precio_base?: number | null
          precio_final?: number | null
          telefono?: string
          tematica_invitacion?: string | null
          tipo_reserva?: Database["public"]["Enums"]["tipo_reserva"]
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      actividad: "laser_tag" | "realidad_virtual" | "combinada"
      app_role: "admin" | "user"
      duracion_reserva: "90" | "150" | "270"
      estado_reserva:
        | "pendiente_pago"
        | "pago_recibido"
        | "confirmada"
        | "cancelada"
      tipo_reserva: "cumpleanos" | "grupos" | "despedida"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      actividad: ["laser_tag", "realidad_virtual", "combinada"],
      app_role: ["admin", "user"],
      duracion_reserva: ["90", "150", "270"],
      estado_reserva: [
        "pendiente_pago",
        "pago_recibido",
        "confirmada",
        "cancelada",
      ],
      tipo_reserva: ["cumpleanos", "grupos", "despedida"],
    },
  },
} as const
