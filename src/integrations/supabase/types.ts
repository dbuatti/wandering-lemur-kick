// Database types in the shape produced by `supabase gen types typescript`.
//
// Hand-written from the SQL in this folder plus the columns the app reads and
// writes (clients, invoices, settings and ticket_ai_analyses have no schema
// file here). Regenerate and replace this file when CLI access is available:
//   npx supabase gen types typescript --project-id gjzjrhredmheepmgpnjk > src/integrations/supabase/types.ts

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  public: {
    Tables: {
      clients: {
        Row: {
          id: string;
          owner_user_id: string | null;
          display_name: string;
          email: string | null;
          phone: string | null;
          type: string | null;
          job_title: string | null;
          is_company: boolean | null;
          is_it_client: boolean | null;
          created_at: string | null;
          updated_at: string | null;
        };
        Insert: {
          id?: string;
          owner_user_id?: string | null;
          display_name: string;
          email?: string | null;
          phone?: string | null;
          type?: string | null;
          job_title?: string | null;
          is_company?: boolean | null;
          is_it_client?: boolean | null;
          created_at?: string | null;
          updated_at?: string | null;
        };
        Update: Partial<Database["public"]["Tables"]["clients"]["Insert"]>;
        Relationships: [];
      };
      client_assets: {
        Row: {
          id: string;
          client_id: string | null;
          owner_user_id: string | null;
          asset_type: string;
          name: string;
          details: Json | null;
          created_at: string | null;
          updated_at: string | null;
        };
        Insert: {
          id?: string;
          client_id?: string | null;
          owner_user_id?: string | null;
          asset_type: string;
          name: string;
          details?: Json | null;
          created_at?: string | null;
          updated_at?: string | null;
        };
        Update: Partial<Database["public"]["Tables"]["client_assets"]["Insert"]>;
        Relationships: [
          {
            foreignKeyName: "client_assets_client_id_fkey";
            columns: ["client_id"];
            isOneToOne: false;
            referencedRelation: "clients";
            referencedColumns: ["id"];
          },
        ];
      };
      invoices: {
        Row: {
          id: string;
          owner_user_id: string | null;
          number: string | null;
          client_id: string | null;
          client_display_name: string | null;
          invoice_date: string | null;
          due_date: string | null;
          status: string | null;
          type: string | null;
          line_items: Json | null;
          untaxed_amount: number | null;
          tax_amount: number | null;
          total_amount: number | null;
          company_currency: string | null;
          public_share_token: string | null;
          created_at: string | null;
          updated_at: string | null;
        };
        Insert: {
          id?: string;
          owner_user_id?: string | null;
          number?: string | null;
          client_id?: string | null;
          client_display_name?: string | null;
          invoice_date?: string | null;
          due_date?: string | null;
          status?: string | null;
          type?: string | null;
          line_items?: Json | null;
          untaxed_amount?: number | null;
          tax_amount?: number | null;
          total_amount?: number | null;
          company_currency?: string | null;
          public_share_token?: string | null;
          created_at?: string | null;
          updated_at?: string | null;
        };
        Update: Partial<Database["public"]["Tables"]["invoices"]["Insert"]>;
        Relationships: [
          {
            foreignKeyName: "invoices_client_id_fkey";
            columns: ["client_id"];
            isOneToOne: false;
            referencedRelation: "clients";
            referencedColumns: ["id"];
          },
        ];
      };
      settings: {
        Row: {
          id: string;
          owner_user_id: string;
          company_name: string | null;
          company_abn: string | null;
          company_email: string | null;
          company_phone: string | null;
          company_website: string | null;
          company_tax_status: string | null;
          company_banking_details: Json | null;
          sender_name: string | null;
          invoice_prefix: string | null;
          invoice_next_number: number | null;
          payment_terms: string | null;
          created_at: string | null;
          updated_at: string | null;
        };
        Insert: {
          id?: string;
          owner_user_id: string;
          company_name?: string | null;
          company_abn?: string | null;
          company_email?: string | null;
          company_phone?: string | null;
          company_website?: string | null;
          company_tax_status?: string | null;
          company_banking_details?: Json | null;
          sender_name?: string | null;
          invoice_prefix?: string | null;
          invoice_next_number?: number | null;
          payment_terms?: string | null;
          created_at?: string | null;
          updated_at?: string | null;
        };
        Update: Partial<Database["public"]["Tables"]["settings"]["Insert"]>;
        Relationships: [];
      };
      tickets: {
        Row: {
          id: string;
          ticket_number: number | null;
          client_id: string | null;
          client_display_name: string | null;
          client_email: string | null;
          client_phone: string | null;
          title: string;
          description: string;
          priority: string | null;
          status: string | null;
          category: string | null;
          service_tier: string | null;
          attachments: string[] | null;
          tags: string[] | null;
          estimated_hours: number | null;
          actual_hours: number | null;
          internal_notes: string | null;
          owner_user_id: string | null;
          assigned_to: string | null;
          related_invoice_id: string | null;
          related_quote_id: string | null;
          created_at: string | null;
          updated_at: string | null;
          resolved_at: string | null;
        };
        Insert: {
          id?: string;
          ticket_number?: number | null;
          client_id?: string | null;
          client_display_name?: string | null;
          client_email?: string | null;
          client_phone?: string | null;
          title: string;
          description: string;
          priority?: string | null;
          status?: string | null;
          category?: string | null;
          service_tier?: string | null;
          attachments?: string[] | null;
          tags?: string[] | null;
          estimated_hours?: number | null;
          actual_hours?: number | null;
          internal_notes?: string | null;
          owner_user_id?: string | null;
          assigned_to?: string | null;
          related_invoice_id?: string | null;
          related_quote_id?: string | null;
          created_at?: string | null;
          updated_at?: string | null;
          resolved_at?: string | null;
        };
        Update: Partial<Database["public"]["Tables"]["tickets"]["Insert"]>;
        Relationships: [
          {
            foreignKeyName: "tickets_client_id_fkey";
            columns: ["client_id"];
            isOneToOne: false;
            referencedRelation: "clients";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "tickets_related_invoice_id_fkey";
            columns: ["related_invoice_id"];
            isOneToOne: false;
            referencedRelation: "invoices";
            referencedColumns: ["id"];
          },
        ];
      };
      ticket_comments: {
        Row: {
          id: string;
          ticket_id: string | null;
          user_id: string | null;
          content: string;
          is_internal: boolean | null;
          created_at: string | null;
          updated_at: string | null;
        };
        Insert: {
          id?: string;
          ticket_id?: string | null;
          user_id?: string | null;
          content: string;
          is_internal?: boolean | null;
          created_at?: string | null;
          updated_at?: string | null;
        };
        Update: Partial<Database["public"]["Tables"]["ticket_comments"]["Insert"]>;
        Relationships: [
          {
            foreignKeyName: "ticket_comments_ticket_id_fkey";
            columns: ["ticket_id"];
            isOneToOne: false;
            referencedRelation: "tickets";
            referencedColumns: ["id"];
          },
        ];
      };
      ticket_ai_analyses: {
        Row: {
          id: string;
          ticket_id: string;
          summary: string | null;
          solution: string | null;
          confidence: number | null;
          created_at: string | null;
          updated_at: string | null;
        };
        Insert: {
          id?: string;
          ticket_id: string;
          summary?: string | null;
          solution?: string | null;
          confidence?: number | null;
          created_at?: string | null;
          updated_at?: string | null;
        };
        Update: Partial<Database["public"]["Tables"]["ticket_ai_analyses"]["Insert"]>;
        Relationships: [
          {
            foreignKeyName: "ticket_ai_analyses_ticket_id_fkey";
            columns: ["ticket_id"];
            isOneToOne: true;
            referencedRelation: "tickets";
            referencedColumns: ["id"];
          },
        ];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};

type PublicTables = Database["public"]["Tables"];

export type Tables<T extends keyof PublicTables> = PublicTables[T]["Row"];
export type TablesInsert<T extends keyof PublicTables> = PublicTables[T]["Insert"];
export type TablesUpdate<T extends keyof PublicTables> = PublicTables[T]["Update"];

export type Client = Tables<"clients">;
export type ClientAsset = Tables<"client_assets">;
export type Invoice = Tables<"invoices">;
export type Settings = Tables<"settings">;
export type Ticket = Tables<"tickets">;
export type TicketComment = Tables<"ticket_comments">;
export type TicketAIAnalysisRow = Tables<"ticket_ai_analyses">;

// Shapes stored inside JSON columns
export type InvoiceLineItem = {
  description: string;
  quantity: number;
  unit_price: number;
  tax_rate: number;
};

export type BankingDetails = {
  bank_name?: string;
  bsb?: string;
  account_number?: string;
};

export type AssetDetails = {
  serial_number?: string;
  model?: string;
  username?: string;
  password?: string;
  url?: string;
  license_key?: string;
  notes?: string;
  related_device_id?: string;
  completedIds?: string[];
};

export type ClientAssetRecord = Omit<ClientAsset, "details"> & {
  details: AssetDetails | null;
};

export type InvoiceRecord = Omit<Invoice, "line_items"> & {
  line_items: InvoiceLineItem[] | null;
};

export type SettingsRecord = Omit<Settings, "company_banking_details"> & {
  company_banking_details: BankingDetails | null;
};
