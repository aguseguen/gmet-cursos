export type Provider = {
  id: string; // uuid
  name: string;
  created_at: string;
};

export type Course = {
  id: string; // uuid
  title: string;
  description: string;
  provider_id: string | null; // fk -> providers.id
  provider?: { id: string; name: string }; // join con tabla providers
  category: string; // ej: "Backend", "Data", "IA", "Diseño", etc.
  category_custom: string | null; // texto libre cuando category === "Otro"
  age_range: string | null; // ej: "18-35 años", "Sin límite"
  status: "draft" | "published";
  registration_deadline: string | null; // ISO date, null si no tiene fecha
  access_url: string;
  is_active: boolean; // control manual por si quieren desactivar uno
  created_at: string;
};

export type CourseExtracted = {
  title: string | null;
  description: string | null;
  provider: string | null;
  category: string | null;
  registration_deadline: string | null;
  access_url: string | null;
  age_range: string | null;
};
