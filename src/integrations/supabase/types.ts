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
      chat_eventos: {
        Row: {
          created_at: string
          escalada: boolean
          id: string
          session_id: string
        }
        Insert: {
          created_at?: string
          escalada?: boolean
          id?: string
          session_id: string
        }
        Update: {
          created_at?: string
          escalada?: boolean
          id?: string
          session_id?: string
        }
        Relationships: []
      }
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
      instagram_sync_config: {
        Row: {
          active: boolean
          created_at: string
          id: string
          last_sync_at: string | null
          sheet_name: string
          spreadsheet_id: string
          updated_at: string
        }
        Insert: {
          active?: boolean
          created_at?: string
          id?: string
          last_sync_at?: string | null
          sheet_name?: string
          spreadsheet_id: string
          updated_at?: string
        }
        Update: {
          active?: boolean
          created_at?: string
          id?: string
          last_sync_at?: string | null
          sheet_name?: string
          spreadsheet_id?: string
          updated_at?: string
        }
        Relationships: []
      }
      lead_emails_pendientes: {
        Row: {
          body_html: string
          categoria: string
          created_at: string
          id: string
          lead_id: string
          recipient_email: string
          recipient_nombre: string
          sent_at: string | null
          status: string
          subject: string
          updated_at: string
        }
        Insert: {
          body_html: string
          categoria: string
          created_at?: string
          id?: string
          lead_id: string
          recipient_email: string
          recipient_nombre: string
          sent_at?: string | null
          status?: string
          subject: string
          updated_at?: string
        }
        Update: {
          body_html?: string
          categoria?: string
          created_at?: string
          id?: string
          lead_id?: string
          recipient_email?: string
          recipient_nombre?: string
          sent_at?: string | null
          status?: string
          subject?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "lead_emails_pendientes_lead_id_fkey"
            columns: ["lead_id"]
            isOneToOne: false
            referencedRelation: "leads_rapidos"
            referencedColumns: ["id"]
          },
        ]
      }
      leads_rapidos: {
        Row: {
          actividad_interes: string | null
          categoria: string
          client_timestamp: string | null
          codigo_postal: string | null
          como_nos_conociste: string | null
          consentimiento: boolean
          created_at: string
          cuando: string | null
          edad_participantes: string | null
          email: string | null
          fecha_orientativa: string | null
          id: string
          motivos_score: Json
          nombre: string
          num_personas: string | null
          page_url: string | null
          presupuesto: string | null
          score: number
          source: string
          telefono: string | null
          tipo_evento: string
          utm_campaign: string | null
          utm_content: string | null
          utm_medium: string | null
          utm_source: string | null
          utm_term: string | null
        }
        Insert: {
          actividad_interes?: string | null
          categoria?: string
          client_timestamp?: string | null
          codigo_postal?: string | null
          como_nos_conociste?: string | null
          consentimiento?: boolean
          created_at?: string
          cuando?: string | null
          edad_participantes?: string | null
          email?: string | null
          fecha_orientativa?: string | null
          id?: string
          motivos_score?: Json
          nombre: string
          num_personas?: string | null
          page_url?: string | null
          presupuesto?: string | null
          score?: number
          source?: string
          telefono?: string | null
          tipo_evento: string
          utm_campaign?: string | null
          utm_content?: string | null
          utm_medium?: string | null
          utm_source?: string | null
          utm_term?: string | null
        }
        Update: {
          actividad_interes?: string | null
          categoria?: string
          client_timestamp?: string | null
          codigo_postal?: string | null
          como_nos_conociste?: string | null
          consentimiento?: boolean
          created_at?: string
          cuando?: string | null
          edad_participantes?: string | null
          email?: string | null
          fecha_orientativa?: string | null
          id?: string
          motivos_score?: Json
          nombre?: string
          num_personas?: string | null
          page_url?: string | null
          presupuesto?: string | null
          score?: number
          source?: string
          telefono?: string | null
          tipo_evento?: string
          utm_campaign?: string | null
          utm_content?: string | null
          utm_medium?: string | null
          utm_source?: string | null
          utm_term?: string | null
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
          motivos_sospecha: string[]
          nombre_completo: string
          nombre_menor: string | null
          notas: string | null
          num_participantes: number
          precio_base: number | null
          precio_final: number | null
          score_sospecha: number
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
          motivos_sospecha?: string[]
          nombre_completo: string
          nombre_menor?: string | null
          notas?: string | null
          num_participantes: number
          precio_base?: number | null
          precio_final?: number | null
          score_sospecha?: number
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
          motivos_sospecha?: string[]
          nombre_completo?: string
          nombre_menor?: string | null
          notas?: string | null
          num_participantes?: number
          precio_base?: number | null
          precio_final?: number | null
          score_sospecha?: number
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
        | "sospechosa"
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
        "sospechosa",
      ],
      tipo_reserva: ["cumpleanos", "grupos", "despedida"],
    },
  },
} as const
