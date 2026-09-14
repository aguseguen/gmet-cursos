"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { createSupabaseBrowserClient } from "@/lib/supabase-browser";
import type { Course, CourseExtracted } from "@/types/course";
import AdminCourseForm from "@/components/AdminCourseForm";
import AdminCourseTable from "@/components/AdminCourseTable";
import AICoursLoader from "@/components/AICoursLoader";

export default function AdminDashboard() {
  const router = useRouter();
  const [courses, setCourses] = useState<Course[]>([]);
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);
  const [extractedValues, setExtractedValues] =
    useState<CourseExtracted | null>(null);

  const loadCourses = useCallback(async () => {
    const { data } = await supabase
      .from("courses")
      .select("*, provider:providers(id, name)")
      .order("created_at", { ascending: false });
    setCourses((data ?? []) as Course[]);
  }, []);

  useEffect(() => {
    loadCourses();
  }, [loadCourses]);

  const handleDelete = async (id: string) => {
    await supabase.from("courses").delete().eq("id", id);
    loadCourses();
  };

  const handleSaved = () => {
    setEditingCourse(null);
    loadCourses();
  };

  const handleLogout = async () => {
    const supabaseBrowser = createSupabaseBrowserClient();
    await supabaseBrowser.auth.signOut();
    router.push("/admin/login");
    router.refresh();
  };

  return (
    <main className="min-h-screen bg-brand-dark px-4 py-10 sm:px-8">
      <div className="mx-auto max-w-6xl">
        <header className="mb-8 flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="font-fredoka text-3xl text-white">Panel Admin</h1>
            <p className="font-dmsans text-brand-blush">GMET Cursos</p>
          </div>
          <div className="flex gap-3">
            <Link
              href="/"
              className="rounded-lg border border-brand-plum px-4 py-2 font-dmsans text-sm text-brand-blush transition-colors hover:bg-brand-surface"
            >
              Ver sitio público
            </Link>
            <button
              type="button"
              onClick={handleLogout}
              className="rounded-lg border border-brand-plum px-4 py-2 font-dmsans text-sm text-brand-blush transition-colors hover:bg-brand-surface"
            >
              Cerrar sesión
            </button>
          </div>
        </header>

        <AICoursLoader onExtracted={setExtractedValues} />

        <section className="mb-10 rounded-2xl border border-brand-plum bg-brand-surface p-6">
          <h2 className="mb-4 font-fredoka text-xl text-white">
            {editingCourse ? "Editar curso" : "Nuevo curso"}
          </h2>
          <AdminCourseForm
            course={editingCourse}
            initialValues={extractedValues}
            onSaved={handleSaved}
            onCancelEdit={() => setEditingCourse(null)}
          />
        </section>

        <section>
          <h2 className="mb-4 font-fredoka text-xl text-white">
            Cursos existentes
          </h2>
          <AdminCourseTable
            courses={courses}
            onEdit={setEditingCourse}
            onDelete={handleDelete}
          />
        </section>
      </div>
    </main>
  );
}
