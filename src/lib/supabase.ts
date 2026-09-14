import { createClient } from "@supabase/supabase-js";
import type { Course, Provider } from "@/types/course";


type CourseRow = Omit<Course, "provider">;

export type Database = {
  public: {
    Tables: {
      courses: {
        Row: CourseRow;
        Insert: Omit<CourseRow, "id" | "created_at"> & {
          id?: string;
          created_at?: string;
        };
        Update: Partial<Omit<CourseRow, "id" | "created_at">>;
        Relationships: [];
      };
      providers: {
        Row: Provider;
        Insert: Omit<Provider, "id" | "created_at"> & {
          id?: string;
          created_at?: string;
        };
        Update: Partial<Omit<Provider, "id" | "created_at">>;
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
  };
};

// Fallback a valores placeholder: createClient() lanza una excepción de
// inmediato si la URL está vacía, lo que rompería el build (Next.js importa
// este módulo al recolectar datos de las páginas) mientras `.env.local` no
// tenga las credenciales reales todavía.
const supabaseUrl =
  process.env.NEXT_PUBLIC_SUPABASE_URL || "https://placeholder.supabase.co";
const supabaseAnonKey =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "placeholder-anon-key";

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);
