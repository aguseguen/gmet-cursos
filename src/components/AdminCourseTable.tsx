"use client";

import { useMemo, useState } from "react";
import { ArrowDown, ArrowUp, ArrowUpDown, Search, X } from "lucide-react";
import type { Course } from "@/types/course";
import { getCourseStatus, parseDateOnly } from "@/lib/courseUtils";
import StatusBadge from "@/components/StatusBadge";

interface AdminCourseTableProps {
  courses: Course[];
  onEdit: (course: Course) => void;
  onDelete: (id: string) => void;
}

type SortKey =
  | "title"
  | "provider"
  | "category"
  | "status"
  | "created_at"
  | "registration_deadline";

const ALL_FILTER = "Todos";

const STATUS_LABELS: Record<Course["status"], string> = {
  published: "Publicado",
  draft: "Borrador",
};

function formatDeadline(deadline: string | null) {
  if (!deadline) return "—";
  return parseDateOnly(deadline).toLocaleDateString("es-AR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

function formatCreatedAt(createdAt: string) {
  return new Date(createdAt).toLocaleDateString("es-AR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

function displayCategory(course: Course) {
  return course.category === "Otro"
    ? course.category_custom || course.category
    : course.category;
}

function sortValue(course: Course, key: SortKey): string | number {
  switch (key) {
    case "title":
      return course.title.toLowerCase();
    case "provider":
      return (course.provider?.name ?? "").toLowerCase();
    case "category":
      return displayCategory(course).toLowerCase();
    case "status":
      return course.status;
    case "created_at":
      return new Date(course.created_at).getTime();
    case "registration_deadline":
      return course.registration_deadline
        ? parseDateOnly(course.registration_deadline).getTime()
        : -Infinity;
    default:
      return "";
  }
}

export default function AdminCourseTable({
  courses,
  onEdit,
  onDelete,
}: AdminCourseTableProps) {
  const [pendingDelete, setPendingDelete] = useState<Course | null>(null);
  const [viewDescription, setViewDescription] = useState<Course | null>(null);

  const [search, setSearch] = useState("");
  const [providerFilter, setProviderFilter] = useState(ALL_FILTER);
  const [categoryFilter, setCategoryFilter] = useState(ALL_FILTER);
  const [statusFilter, setStatusFilter] = useState(ALL_FILTER);

  const [sortKey, setSortKey] = useState<SortKey | null>(null);
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");

  const providerOptions = useMemo(
    () => [
      ALL_FILTER,
      ...Array.from(
        new Set(
          courses
            .map((c) => c.provider?.name)
            .filter((name): name is string => Boolean(name))
        )
      ).sort(),
    ],
    [courses]
  );

  const categoryOptions = useMemo(
    () => [
      ALL_FILTER,
      ...Array.from(new Set(courses.map((c) => displayCategory(c)))).sort(),
    ],
    [courses]
  );

  const filteredCourses = useMemo(() => {
    const query = search.trim().toLowerCase();

    return courses.filter((course) => {
      if (
        providerFilter !== ALL_FILTER &&
        course.provider?.name !== providerFilter
      )
        return false;
      if (
        categoryFilter !== ALL_FILTER &&
        displayCategory(course) !== categoryFilter
      )
        return false;
      if (
        statusFilter !== ALL_FILTER &&
        STATUS_LABELS[course.status] !== statusFilter
      )
        return false;
      if (query) {
        const haystack = [
          course.title,
          course.description,
          course.provider?.name ?? "",
          displayCategory(course),
        ]
          .join(" ")
          .toLowerCase();
        if (!haystack.includes(query)) return false;
      }
      return true;
    });
  }, [courses, providerFilter, categoryFilter, statusFilter, search]);

  const sortedCourses = useMemo(() => {
    if (!sortKey) return filteredCourses;
    const sorted = [...filteredCourses].sort((a, b) => {
      const va = sortValue(a, sortKey);
      const vb = sortValue(b, sortKey);
      if (va < vb) return -1;
      if (va > vb) return 1;
      return 0;
    });
    return sortDir === "asc" ? sorted : sorted.reverse();
  }, [filteredCourses, sortKey, sortDir]);

  const toggleSort = (key: SortKey) => {
    if (sortKey !== key) {
      setSortKey(key);
      setSortDir("asc");
      return;
    }
    setSortDir((dir) => (dir === "asc" ? "desc" : "asc"));
  };

  const selectClass =
    "rounded-lg border border-brand-plum bg-brand-dark px-3 py-1.5 font-dmsans text-sm text-white outline-none focus:border-brand-pink";

  function SortableHeader({
    label,
    sortableKey,
  }: {
    label: string;
    sortableKey: SortKey;
  }) {
    const isActive = sortKey === sortableKey;
    const Icon = isActive
      ? sortDir === "asc"
        ? ArrowUp
        : ArrowDown
      : ArrowUpDown;

    return (
      <th className="whitespace-nowrap px-4 py-3">
        <button
          type="button"
          onClick={() => toggleSort(sortableKey)}
          className="flex items-center gap-1 font-dmsans text-brand-blush transition-colors hover:text-white"
        >
          {label}
          <Icon size={12} />
        </button>
      </th>
    );
  }

  if (courses.length === 0) {
    return (
      <p className="font-dmsans text-sm text-gray-400">
        Todavía no hay cursos cargados.
      </p>
    );
  }

  return (
    <>
      <div className="mb-4 flex flex-wrap gap-3">
        <div>
          <label className="mb-1 block font-dmsans text-xs text-gray-400">
            Buscar
          </label>
          <div className="relative">
            <Search
              size={14}
              className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />
            <input
              type="text"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Buscar curso..."
              className={`${selectClass} w-56 pl-8 ${search ? "pr-8" : ""}`}
            />
            {search && (
              <button
                type="button"
                onClick={() => setSearch("")}
                aria-label="Limpiar búsqueda"
                className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 transition-colors hover:text-white"
              >
                <X size={14} />
              </button>
            )}
          </div>
        </div>

        <div>
          <label className="mb-1 block font-dmsans text-xs text-gray-400">
            Proveedor
          </label>
          <select
            className={selectClass}
            value={providerFilter}
            onChange={(event) => setProviderFilter(event.target.value)}
          >
            {providerOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="mb-1 block font-dmsans text-xs text-gray-400">
            Categoría
          </label>
          <select
            className={selectClass}
            value={categoryFilter}
            onChange={(event) => setCategoryFilter(event.target.value)}
          >
            {categoryOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="mb-1 block font-dmsans text-xs text-gray-400">
            Estado
          </label>
          <select
            className={selectClass}
            value={statusFilter}
            onChange={(event) => setStatusFilter(event.target.value)}
          >
            {[ALL_FILTER, ...Object.values(STATUS_LABELS)].map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="overflow-x-auto rounded-2xl border border-brand-plum">
        <table className="w-full text-left font-dmsans text-sm">
          <thead className="bg-brand-surface text-brand-blush">
            <tr>
              <SortableHeader label="Título" sortableKey="title" />
              <SortableHeader label="Proveedor" sortableKey="provider" />
              <SortableHeader label="Categoría" sortableKey="category" />
              <th className="whitespace-nowrap px-4 py-3">Descripción</th>
              <SortableHeader label="Estado" sortableKey="status" />
              <th className="whitespace-nowrap px-4 py-3">Vigencia</th>
              <th className="whitespace-nowrap px-4 py-3">Público</th>
              <SortableHeader label="Fecha de alta" sortableKey="created_at" />
              <SortableHeader
                label="Fecha límite"
                sortableKey="registration_deadline"
              />
              <th className="whitespace-nowrap px-4 py-3">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {sortedCourses.map((course) => (
              <tr key={course.id} className="border-t border-brand-plum">
                <td className="px-4 py-3 text-white">{course.title}</td>
                <td className="px-4 py-3 text-gray-300">
                  {course.provider?.name ?? "—"}
                </td>
                <td className="px-4 py-3 text-gray-300">
                  {displayCategory(course)}
                </td>
                <td className="max-w-xs px-4 py-3 text-gray-300">
                  <p className="line-clamp-2">{course.description}</p>
                  <button
                    type="button"
                    onClick={() => setViewDescription(course)}
                    className="mt-1 font-dmsans text-xs text-brand-pink hover:underline"
                  >
                    Ver más
                  </button>
                </td>
                <td className="px-4 py-3">
                  <span
                    className={`inline-flex items-center gap-1.5 rounded-full px-2 py-1 text-xs font-medium ${
                      course.status === "published"
                        ? "bg-green-500/15 text-green-400"
                        : "bg-yellow-500/15 text-yellow-400"
                    }`}
                  >
                    {STATUS_LABELS[course.status]}
                  </span>
                </td>
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
                  {formatCreatedAt(course.created_at)}
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

      {viewDescription && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4">
          <div className="w-full max-w-lg rounded-2xl border border-brand-plum bg-brand-surface p-6">
            <h3 className="font-fredoka text-lg text-white">
              {viewDescription.title}
            </h3>
            <p className="mt-3 whitespace-pre-wrap font-dmsans text-sm text-gray-300">
              {viewDescription.description}
            </p>
            <div className="mt-5 flex justify-end">
              <button
                type="button"
                onClick={() => setViewDescription(null)}
                className="rounded-lg border border-brand-plum px-4 py-2 font-dmsans text-sm text-brand-blush transition-colors hover:bg-brand-plum"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}

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
