"use client";

import { useEffect, useState, type FormEvent } from "react";
import { supabase } from "@/lib/supabase";
import type { Course } from "@/types/course";

const CATEGORIES = [
  "Backend",
  "Frontend",
  "Data Analytics",
  "IA / ML",
  "Ciberseguridad",
  "Diseño UX",
  "Project Management",
  "Cloud",
  "Otro",
];

interface AdminCourseFormProps {
  course?: Course | null;
  onSaved: () => void;
  onCancelEdit?: () => void;
}

interface FormState {
  title: string;
  description: string;
  provider: string;
  category: string;
  registration_deadline: string;
  access_url: string;
  is_active: boolean;
}

const EMPTY_FORM: FormState = {
  title: "",
  description: "",
  provider: "",
  category: CATEGORIES[0],
  registration_deadline: "",
  access_url: "",
  is_active: true,
};

const inputClass =
  "w-full rounded-lg border border-brand-plum bg-brand-dark px-3 py-2 font-dmsans text-white outline-none focus:border-brand-pink";
const labelClass = "mb-1 block font-dmsans text-sm text-gray-300";

export default function AdminCourseForm({
  course,
  onSaved,
  onCancelEdit,
}: AdminCourseFormProps) {
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setError(null);
    setForm(
      course
        ? {
            title: course.title,
            description: course.description,
            provider: course.provider,
            category: course.category,
            registration_deadline: course.registration_deadline ?? "",
            access_url: course.access_url,
            is_active: course.is_active,
          }
        : EMPTY_FORM
    );
  }, [course]);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setIsSaving(true);
    setError(null);

    const payload = {
      title: form.title,
      description: form.description,
      provider: form.provider,
      category: form.category,
      registration_deadline: form.registration_deadline || null,
      access_url: form.access_url,
      is_active: form.is_active,
    };

    const { error: saveError } = course
      ? await supabase.from("courses").update(payload).eq("id", course.id)
      : await supabase.from("courses").insert(payload);

    setIsSaving(false);

    if (saveError) {
      setError(saveError.message);
      return;
    }

    setForm(EMPTY_FORM);
    onSaved();
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div>
        <label className={labelClass} htmlFor="title">
          Título
        </label>
        <input
          id="title"
          required
          className={inputClass}
          value={form.title}
          onChange={(event) =>
            setForm({ ...form, title: event.target.value })
          }
        />
      </div>

      <div>
        <label className={labelClass} htmlFor="description">
          Descripción
        </label>
        <textarea
          id="description"
          required
          rows={3}
          className={inputClass}
          value={form.description}
          onChange={(event) =>
            setForm({ ...form, description: event.target.value })
          }
        />
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label className={labelClass} htmlFor="provider">
            Proveedor
          </label>
          <input
            id="provider"
            required
            className={inputClass}
            value={form.provider}
            onChange={(event) =>
              setForm({ ...form, provider: event.target.value })
            }
          />
        </div>

        <div>
          <label className={labelClass} htmlFor="category">
            Categoría
          </label>
          <select
            id="category"
            className={inputClass}
            value={form.category}
            onChange={(event) =>
              setForm({ ...form, category: event.target.value })
            }
          >
            {CATEGORIES.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label className={labelClass} htmlFor="registration_deadline">
            Fecha límite (opcional)
          </label>
          <input
            id="registration_deadline"
            type="date"
            className={`${inputClass} [&::-webkit-calendar-picker-indicator]:invert`}
            value={form.registration_deadline}
            onChange={(event) =>
              setForm({ ...form, registration_deadline: event.target.value })
            }
          />
        </div>

        <div>
          <label className={labelClass} htmlFor="access_url">
            URL de acceso
          </label>
          <input
            id="access_url"
            type="url"
            required
            className={inputClass}
            value={form.access_url}
            onChange={(event) =>
              setForm({ ...form, access_url: event.target.value })
            }
          />
        </div>
      </div>

      <div className="flex items-center gap-3">
        <button
          type="button"
          role="switch"
          aria-checked={form.is_active}
          onClick={() =>
            setForm({ ...form, is_active: !form.is_active })
          }
          className={`relative h-6 w-11 shrink-0 rounded-full border border-brand-plum transition-colors ${
            form.is_active ? "bg-brand-pink" : "bg-brand-dark"
          }`}
        >
          <span
            className={`absolute left-0.5 top-0.5 h-5 w-5 rounded-full bg-white transition-transform ${
              form.is_active ? "translate-x-5" : "translate-x-0"
            }`}
          />
        </button>
        <span className="font-dmsans text-sm text-gray-300">
          Curso activo
        </span>
      </div>

      {error && <p className="font-dmsans text-sm text-red-400">{error}</p>}

      <div className="flex gap-3">
        <button
          type="submit"
          disabled={isSaving}
          className="rounded-lg bg-brand-pink px-4 py-2 font-dmsans text-sm font-medium text-white transition-colors hover:bg-brand-hot disabled:opacity-60"
        >
          {isSaving
            ? "Guardando..."
            : course
              ? "Guardar cambios"
              : "Crear curso"}
        </button>

        {course && (
          <button
            type="button"
            onClick={onCancelEdit}
            className="rounded-lg border border-brand-plum px-4 py-2 font-dmsans text-sm text-brand-blush transition-colors hover:bg-brand-plum"
          >
            Cancelar
          </button>
        )}
      </div>
    </form>
  );
}
