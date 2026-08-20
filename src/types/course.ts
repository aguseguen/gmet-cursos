export type Course = {
  id: string; // uuid
  title: string;
  description: string;
  provider: string; // empresa u organización que lo ofrece
  category: string; // ej: "Backend", "Data", "IA", "Diseño", etc.
  registration_deadline: string | null; // ISO date, null si no tiene fecha
  access_url: string;
  is_active: boolean; // control manual por si quieren desactivar uno
  created_at: string;
};
