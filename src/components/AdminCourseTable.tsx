"use client";

import { useState } from "react";
import type { Course } from "@/types/course";
import { getCourseStatus, parseDateOnly } from "@/lib/courseUtils";
import StatusBadge from "@/components/StatusBadge";

interface AdminCourseTableProps {
  courses: Course[];
  onEdit: (course: Course) => void;
  onDelete: (id: string) => void;
}

function formatDeadline(deadline: string | null) {
  if (!deadline) return "—";
  return parseDateOnly(deadline).toLocaleDateString("es-AR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

export default function AdminCourseTable({
  courses,
  onEdit,
  onDelete,
}: AdminCourseTableProps) {
  const [pendingDelete, setPendingDelete] = useState<Course | null>(null);

  if (courses.length === 0) {
    return (
      <p className="font-dmsans text-sm text-gray-400">
        Todavía no hay cursos cargados.
      </p>
    );
  }

  return (
    <>
      <div className="overflow-x-auto rounded-2xl border border-brand-plum">
        <table className="w-full text-left font-dmsans text-sm">
          <thead className="bg-brand-surface text-brand-blush">
            <tr>
              <th className="whitespace-nowrap px-4 py-3">Título</th>
              <th className="whitespace-nowrap px-4 py-3">Proveedor</th>
              <th className="whitespace-nowrap px-4 py-3">Estado</th>
              <th className="whitespace-nowrap px-4 py-3">Público</th>
              <th className="whitespace-nowrap px-4 py-3">Fecha límite</th>
              <th className="whitespace-nowrap px-4 py-3">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {courses.map((course) => (
              <tr key={course.id} className="border-t border-brand-plum">
                <td className="px-4 py-3 text-white">{course.title}</td>
                <td className="px-4 py-3 text-gray-300">{course.provider}</td>
                <td className="px-4 py-3">
                  <StatusBadge status={getCourseStatus(course)} />
                </td>
                <td className="px-4 py-3">
                  <span
                    className={`inline-flex items-center gap-1.5 rounded-full px-2 py-1 text-xs font-medium ${
                      course.is_active
                        ? "bg-green-500/15 text-green-400"
                        : "bg-gray-500/15 text-gray-400"
                    }`}
                  >
                    <span
                      className={`h-1.5 w-1.5 rounded-full ${
                        course.is_active ? "bg-green-400" : "bg-gray-400"
                      }`}
                    />
                    {course.is_active ? "Sí" : "No"}
                  </span>
                </td>
                <td className="whitespace-nowrap px-4 py-3 text-gray-300">
                  {formatDeadline(course.registration_deadline)}
                </td>
                <td className="px-4 py-3">
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => onEdit(course)}
                      className="rounded-lg border border-brand-plum px-3 py-1 text-brand-blush transition-colors hover:bg-brand-plum"
                    >
                      Editar
                    </button>
                    <button
                      type="button"
                      onClick={() => setPendingDelete(course)}
                      className="rounded-lg border border-red-900 px-3 py-1 text-red-400 transition-colors hover:bg-red-950"
                    >
                      Eliminar
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {pendingDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4">
          <div className="w-full max-w-sm rounded-2xl border border-brand-plum bg-brand-surface p-6">
            <h3 className="font-fredoka text-lg text-white">
              ¿Eliminar este curso?
            </h3>
            <p className="mt-2 font-dmsans text-sm text-gray-300">
              Estás por eliminar &quot;{pendingDelete.title}&quot;. Esta
              acción no se puede deshacer.
            </p>
            <div className="mt-5 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setPendingDelete(null)}
                className="rounded-lg border border-brand-plum px-4 py-2 font-dmsans text-sm text-brand-blush transition-colors hover:bg-brand-plum"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={() => {
                  onDelete(pendingDelete.id);
                  setPendingDelete(null);
                }}
                className="rounded-lg bg-red-600 px-4 py-2 font-dmsans text-sm font-medium text-white transition-colors hover:bg-red-700"
              >
                Eliminar
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
