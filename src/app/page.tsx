import { CloudOff, LogIn } from "lucide-react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { createSupabaseServerClient } from "@/lib/supabase-server";
import { sortCoursesByStatus } from "@/lib/courseUtils";
import CourseCatalog from "@/components/CourseCatalog";
import type { Course } from "@/types/course";

// "force-dynamic" evita el prerender estático, pero no siempre alcanza para
// que Next.js descarte la Data Cache persistente en disco de los fetches que
// hace supabase-js por debajo. "force-no-store" lo deja explícito: esta
// página nunca debe servir una respuesta cacheada de Supabase.
export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";

export default async function HomePage() {
  const { data, error } = await supabase
    .from("courses")
    .select("*, provider:providers(id, name)")
    .eq("is_active", true)
    .eq("status", "published")
    .order("created_at", { ascending: false });

  const courses = sortCoursesByStatus((data ?? []) as Course[]);

  const supabaseServer = createSupabaseServerClient();
  const {
    data: { user },
  } = await supabaseServer.auth.getUser();

  return (
    <main className="min-h-screen bg-brand-dark px-4 py-10 sm:px-8">
      <div className="mx-auto max-w-6xl">
        <header className="mb-10 flex items-start justify-between gap-4">
          <div>
            <h1 className="font-fredoka text-3xl font-semibold text-white sm:text-4xl">
              GMET
            </h1>
            <p className="font-dmsans text-brand-blush">
              Cursos y Oportunidades
            </p>
          </div>

          <Link
            href={user ? "/admin" : "/admin/login"}
            className="inline-flex shrink-0 items-center gap-1.5 rounded-lg border border-brand-plum px-3 py-1.5 font-dmsans text-xs text-brand-blush transition-colors hover:bg-brand-surface"
          >
            <LogIn size={14} />
            {user ? "Panel admin" : "Iniciar sesión"}
          </Link>
        </header>

        {error ? (
          <div className="flex flex-col items-center gap-3 rounded-2xl border border-brand-plum bg-brand-surface px-6 py-16 text-center">
            <CloudOff className="text-brand-hot" size={32} />
            <p className="font-fredoka text-lg text-white">
              No pudimos cargar los cursos
            </p>
            <p className="font-dmsans text-sm text-gray-400">
              Puede ser un problema temporal de conexión. Probá recargar la
              página en unos minutos.
            </p>
          </div>
        ) : (
          <CourseCatalog courses={courses} />
        )}
      </div>
    </main>
  );
}
