export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  __InternalSupabase: {
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      clientes: {
        Row: {
          configurador: string | null
          creditos: number | null
          criado_em: string
          data_inicio: string | null
          especialidade: string | null
          expectativas: string | null
          forma_pagamento: string | null
          gerente: string | null
          id: string
          idclinic: number | null
          integracao: string | null
          medico_contato: string | null
          mensalidade: number | null
          nome: string
          num_usuarios: number | null
          pipedrive_lead_id: string | null
          plano: string | null
          status: string
          vencimento_dia: number | null
          vendedor: string | null
        }
        Insert: {
          configurador?: string | null
          creditos?: number | null
          criado_em?: string
          data_inicio?: string | null
          especialidade?: string | null
          expectativas?: string | null
          forma_pagamento?: string | null
          gerente?: string | null
          id?: string
          idclinic?: number | null
          integracao?: string | null
          medico_contato?: string | null
          mensalidade?: number | null
          nome: string
          num_usuarios?: number | null
          pipedrive_lead_id?: string | null
          plano?: string | null
          status?: string
          vencimento_dia?: number | null
          vendedor?: string | null
        }
        Update: {
          configurador?: string | null
          creditos?: number | null
          criado_em?: string
          data_inicio?: string | null
          especialidade?: string | null
          expectativas?: string | null
          forma_pagamento?: string | null
          gerente?: string | null
          id?: string
          idclinic?: number | null
          integracao?: string | null
          medico_contato?: string | null
          mensalidade?: number | null
          nome?: string
          num_usuarios?: number | null
          pipedrive_lead_id?: string | null
          plano?: string | null
          status?: string
          vencimento_dia?: number | null
          vendedor?: string | null
        }
        Relationships: []
      }
      kickoffs: {
        Row: {
          cliente_id: string
          criado_em: string
          data_reuniao: string | null
          desafio_principal: string | null
          expectativa: string | null
          ferias_programadas: string | null
          finalizado_em: string | null
          id: string
          mapeamento: Json | null
          mensagens_demo: Json | null
          notas_internas: string | null
          participantes_cliente: Json | null
          passo_atual: number
          status: string
          validacoes_contratuais: Json | null
          variacao_demo: string | null
        }
        Insert: {
          cliente_id: string
          criado_em?: string
          data_reuniao?: string | null
          desafio_principal?: string | null
          expectativa?: string | null
          ferias_programadas?: string | null
          finalizado_em?: string | null
          id?: string
          mapeamento?: Json | null
          mensagens_demo?: Json | null
          notas_internas?: string | null
          participantes_cliente?: Json | null
          passo_atual?: number
          status?: string
          validacoes_contratuais?: Json | null
          variacao_demo?: string | null
        }
        Update: {
          cliente_id?: string
          criado_em?: string
          data_reuniao?: string | null
          desafio_principal?: string | null
          expectativa?: string | null
          ferias_programadas?: string | null
          finalizado_em?: string | null
          id?: string
          mapeamento?: Json | null
          mensagens_demo?: Json | null
          notas_internas?: string | null
          participantes_cliente?: Json | null
          passo_atual?: number
          status?: string
          validacoes_contratuais?: Json | null
          variacao_demo?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "kickoffs_cliente_id_fkey"
            columns: ["cliente_id"]
            isOneToOne: false
            referencedRelation: "clientes"
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
      [_ in never]: never
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
    Enums: {},
  },
} as const