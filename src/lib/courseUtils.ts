import type { Course } from "@/types/course";

export type CourseStatus = "active" | "expiring_soon" | "expired" | "no_deadline";

export const COURSE_STATUS_COLORS: Record<CourseStatus, string> = {
  active: "#22C55E",
  expiring_soon: "#EAB308",
  expired: "#6B7280",
  no_deadline: "#D94F8A", // brand.pink
};

const MS_PER_DAY = 1000 * 60 * 60 * 24;

// `registration_deadline` viene como "YYYY-MM-DD" (sin hora ni zona horaria).
// `new Date("YYYY-MM-DD")` lo interpreta como medianoche UTC, y al mostrarlo
// en un huso horario negativo (como Argentina) aparece un día antes/después.
// Parseamos los componentes a mano y usamos el constructor local para evitar
// esa conversión.
export function parseDateOnly(dateStr: string): Date {
  const [year, month, day] = dateStr.split("-").map(Number);
  return new Date(year, month - 1, day);
}

export function getCourseStatus(course: Course): CourseStatus {
  if (!course.registration_deadline) return "no_deadline";

  const deadlineDay = parseDateOnly(course.registration_deadline);
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  const daysUntilDeadline = Math.round(
    (deadlineDay.getTime() - today.getTime()) / MS_PER_DAY
  );

  if (daysUntilDeadline < 0) return "expired";
  if (daysUntilDeadline <= 7) return "expiring_soon";
  return "active";
}

const STATUS_DISPLAY_ORDER: Record<CourseStatus, number> = {
  expiring_soon: 0,
  active: 1,
  no_deadline: 2,
  expired: 3,
};

export function sortCoursesByStatus(courses: Course[]): Course[] {
  return [...courses].sort(
    (a, b) =>
      STATUS_DISPLAY_ORDER[getCourseStatus(a)] -
      STATUS_DISPLAY_ORDER[getCourseStatus(b)]
  );
}
