"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import type { Course } from "@/types/course";
import AdminCourseForm from "@/components/AdminCourseForm";
import AdminCourseTable from "@/components/AdminCourseTable";

const ADMIN_AUTH_KEY = "gmet_admin_auth";

export default function AdminPage() {
  const router = useRouter();
  const [isChecking, setIsChecking] = useState(true);
  const [courses, setCourses] = useState<Course[]>([]);
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);

  useEffect(() => {
    if (sessionStorage.getItem(ADMIN_AUTH_KEY) !== "true") {
      router.replace("/admin/login");
      return;
    }
    setIsChecking(false);
  }, [router]);

  const loadCourses = useCallback(async () => {
    const { data } = await supabase
      .from("courses")
      .select("*")
      .order("created_at", { ascending: false });
    setCourses((data ?? []) as Course[]);
  }, []);

  useEffect(() => {
    if (!isChecking) loadCourses();
  }, [isChecking, loadCourses]);

  const handleDelete = async (id: string) => {
    await supabase.from("courses").delete().eq("id", id);
    loadCourses();
  };

  const handleSaved = () => {
    setEditingCourse(null);
    loadCourses();
  };

  if (isChecking) return null;

  return (
    <main className="min-h-screen bg-brand-dark px-4 py-10 sm:px-8">
      <div className="mx-auto max-w-6xl">
        <header className="mb-8 flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="font-fredoka text-3xl text-white">Panel Admin</h1>
            <p className="font-dmsans text-brand-blush">GMET Cursos</p>
          </div>
          <Link
            href="/"
            className="rounded-lg border border-brand-plum px-4 py-2 font-dmsans text-sm text-brand-blush transition-colors hover:bg-brand-surface"
          >
            Ver sitio público
          </Link>
        </header>

        <section className="mb-10 rounded-2xl border border-brand-plum bg-brand-surface p-6">
          <h2 className="mb-4 font-fredoka text-xl text-white">
            {editingCourse ? "Editar curso" : "Nuevo curso"}
          </h2>
          <AdminCourseForm
            course={editingCourse}
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
