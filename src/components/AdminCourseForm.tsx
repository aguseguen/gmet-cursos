"use client";

import { useEffect, useState, type FormEvent } from "react";
import { supabase } from "@/lib/supabase";
import type { Course, CourseExtracted, Provider } from "@/types/course";

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

const OTRO_CATEGORY = "Otro";
const NEW_PROVIDER_VALUE = "__new__";

interface AdminCourseFormProps {
  course?: Course | null;
  initialValues?: CourseExtracted | null;
  onSaved: () => void;
  onCancelEdit?: () => void;
}

interface FormState {
  title: string;
  description: string;
  providerId: string;
  newProviderName: string;
  category: string;
  categoryCustom: string;
  ageRange: string;
  status: "draft" | "published";
  registration_deadline: string;
  access_url: string;
  is_active: boolean;
}

const EMPTY_FORM: FormState = {
  title: "",
  description: "",
  providerId: "",
  newProviderName: "",
  category: CATEGORIES[0],
  categoryCustom: "",
  ageRange: "",
  status: "published",
  registration_deadline: "",
  access_url: "",
  is_active: true,
};

const inputClass =
  "w-full rounded-lg border border-brand-plum bg-brand-dark px-3 py-2 font-dmsans text-white outline-none focus:border-brand-pink";
const labelClass = "mb-1 block font-dmsans text-sm text-gray-300";

export default function AdminCourseForm({
  course,
  initialValues,
  onSaved,
  onCancelEdit,
}: AdminCourseFormProps) {
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [providers, setProviders] = useState<Provider[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadProviders = async () => {
    const { data } = await supabase
      .from("providers")
      .select("*")
      .order("name", { ascending: true });
    setProviders((data ?? []) as Provider[]);
  };

  useEffect(() => {
    loadProviders();
  }, []);

  useEffect(() => {
    setError(null);
    setForm(
      course
        ? {
            title: course.title,
            description: course.description,
            providerId: course.provider_id ?? "",
            newProviderName: "",
            category: course.category,
            categoryCustom: course.category_custom ?? "",
            ageRange: course.age_range ?? "",
            status: course.status ?? "published",
            registration_deadline: course.registration_deadline ?? "",
            access_url: course.access_url,
            is_active: course.is_active,
          }
        : EMPTY_FORM
    );
  }, [course]);

  useEffect(() => {
    if (!initialValues) return;

    const matchedProvider = initialValues.provider
      ? providers.find(
          (provider) =>
            provider.name.toLowerCase() ===
            initialValues.provider!.trim().toLowerCase()
        )
      : undefined;

    const matchedCategory = initialValues.category
      ? CATEGORIES.find(
          (category) =>
            category.toLowerCase() ===
            initialValues.category!.trim().toLowerCase()
        )
      : undefined;

    setError(null);
    setForm({
      title: initialValues.title ?? "",
      description: initialValues.description ?? "",
      providerId: matchedProvider
        ? matchedProvider.id
        : initialValues.provider
          ? NEW_PROVIDER_VALUE
          : "",
      newProviderName: matchedProvider ? "" : initialValues.provider ?? "",
      category: matchedCategory ?? (initialValues.category ? OTRO_CATEGORY : CATEGORIES[0]),
      categoryCustom: matchedCategory ? "" : initialValues.category ?? "",
      ageRange: initialValues.age_range ?? "",
      status: "draft",
      registration_deadline: initialValues.registration_deadline ?? "",
      access_url: initialValues.access_url ?? "",
      is_active: true,
    });
  }, [initialValues, providers]);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setError(null);

    const isNewProvider = form.providerId === NEW_PROVIDER_VALUE;

    if (isNewProvider && !form.newProviderName.trim()) {
      setError("Ingresá el nombre del nuevo proveedor.");
      return;
    }
    if (!isNewProvider && !form.providerId) {
      setError("Seleccioná un proveedor.");
      return;
    }
    if (form.category === OTRO_CATEGORY && !form.categoryCustom.trim()) {
      setError("Ingresá la categoría personalizada.");
      return;
    }

    setIsSaving(true);

    let providerId = form.providerId;

    if (isNewProvider) {
      const { data: newProvider, error: providerError } = await supabase
        .from("providers")
        .insert({ name: form.newProviderName.trim() })
        .select()
        .single();

      if (providerError || !newProvider) {
        setIsSaving(false);
        setError(providerError?.message ?? "No se pudo crear el proveedor.");
        return;
      }

      providerId = newProvider.id;
    }

    const payload = {
      title: form.title,
      description: form.description,
      provider_id: providerId,
      category: form.category,
      category_custom:
        form.category === OTRO_CATEGORY ? form.categoryCustom.trim() : null,
      age_range: form.ageRange.trim() || null,
      status: form.status,
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

    if (isNewProvider) loadProviders();

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
          <select
            id="provider"
            required
            className={inputClass}
            value={form.providerId}
            onChange={(event) =>
              setForm({ ...form, providerId: event.target.value })
            }
          >
            <option value="" disabled>
              Seleccioná un proveedor
            </option>
            {providers.map((provider) => (
              <option key={provider.id} value={provider.id}>
                {provider.name}
              </option>
            ))}
            <option value={NEW_PROVIDER_VALUE}>+ Agregar proveedor</option>
          </select>

          {form.providerId === NEW_PROVIDER_VALUE && (
            <input
              className={`${inputClass} mt-2`}
              placeholder="Nombre del nuevo proveedor"
              value={form.newProviderName}
              onChange={(event) =>
                setForm({ ...form, newProviderName: event.target.value })
              }
            />
          )}
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

          {form.category === OTRO_CATEGORY && (
            <input
              className={`${inputClass} mt-2`}
              placeholder="Escribí la categoría"
              value={form.categoryCustom}
              onChange={(event) =>
                setForm({ ...form, categoryCustom: event.target.value })
              }
            />
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label className={labelClass} htmlFor="age_range">
            Rango de edad (opcional)
          </label>
          <input
            id="age_range"
            className={inputClass}
            placeholder='Ej: "18-35 años", "Sin límite"'
            value={form.ageRange}
            onChange={(event) =>
              setForm({ ...form, ageRange: event.target.value })
            }
          />
        </div>

        <div>
          <label className={labelClass} htmlFor="status">
            Estado
          </label>
          <select
            id="status"
            className={inputClass}
            value={form.status}
            onChange={(event) =>
              setForm({
                ...form,
                status: event.target.value as "draft" | "published",
              })
            }
          >
            <option value="published">Publicado</option>
            <option value="draft">Borrador</option>
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
