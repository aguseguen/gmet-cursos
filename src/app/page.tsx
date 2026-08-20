import { CloudOff } from "lucide-react";
import { supabase } from "@/lib/supabase";
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
    .select("*")
    .eq("is_active", true)
    .order("created_at", { ascending: false });

  const courses = sortCoursesByStatus((data ?? []) as Course[]);

  return (
    <main className="min-h-screen bg-brand-dark px-4 py-10 sm:px-8">
      <div className="mx-auto max-w-6xl">
        <header className="mb-10">
          <h1 className="font-fredoka text-3xl font-semibold text-white sm:text-4xl">
            GMET
          </h1>
          <p className="font-dmsans text-brand-blush">
            Cursos y Oportunidades
          </p>
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
