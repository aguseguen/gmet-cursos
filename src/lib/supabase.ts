import { createClient } from "@supabase/supabase-js";
import type { Course } from "@/types/course";

/**
 * SQL para ejecutar en el SQL Editor del dashboard de Supabase.
 * Crea la tabla `courses` y sus políticas de RLS.
 *
 * -- Extensión para generar uuids
 * create extension if not exists "pgcrypto";
 *
 * -- Tabla courses
 * create table if not exists public.courses (
 *   id uuid primary key default gen_random_uuid(),
 *   title text not null,
 *   description text not null,
 *   provider text not null,
 *   category text not null,
 *   registration_deadline date,
 *   access_url text not null,
 *   is_active boolean not null default true,
 *   created_at timestamptz not null default now()
 * );
 *
 * -- Habilitar RLS
 * alter table public.courses enable row level security;
 *
 * -- SELECT: público, cualquiera puede leer
 * create policy "courses_select_public"
 *   on public.courses
 *   for select
 *   using (true);
 *
 * -- INSERT/UPDATE/DELETE: pensado para usuarios autenticados, pero el panel
 * -- admin todavía no usa Supabase Auth (solo un password vía env var), así
 * -- que por ahora se dejan permisivas para `anon` también. Cuando se
 * -- implemente auth real, restringir estas policies a `to authenticated`.
 * create policy "courses_insert_permissive"
 *   on public.courses
 *   for insert
 *   with check (true);
 *
 * create policy "courses_update_permissive"
 *   on public.courses
 *   for update
 *   using (true)
 *   with check (true);
 *
 * create policy "courses_delete_permissive"
 *   on public.courses
 *   for delete
 *   using (true);
 */

export type Database = {
  public: {
    Tables: {
      courses: {
        Row: Course;
        Insert: Omit<Course, "id" | "created_at"> & {
          id?: string;
          created_at?: string;
        };
        Update: Partial<Omit<Course, "id" | "created_at">>;
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
