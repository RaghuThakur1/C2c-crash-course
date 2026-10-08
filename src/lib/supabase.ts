import { createClient } from "@supabase/supabase-js";
import type { ClubName } from "@/lib/clubs";

export type Database = {
  public: {
    Tables: {
      club_signups: {
        Row: {
          id: string;
          full_name: string;
          student_id: string;
          club_name: ClubName;
          created_at: string;
        };
        Insert: {
          id?: string;
          full_name: string;
          student_id: string;
          club_name: ClubName;
          created_at?: string;
        };
        Update: {
          id?: string;
          full_name?: string;
          student_id?: string;
          club_name?: ClubName;
          created_at?: string;
        };
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
};

export type Registration = Database["public"]["Tables"]["club_signups"]["Row"];

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export const supabase =
  supabaseUrl && supabaseAnonKey
    ? createClient<Database>(supabaseUrl, supabaseAnonKey)
    : null;
