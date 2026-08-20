import { BookOpen } from "lucide-react";
import type { Course } from "@/types/course";
import CourseCard from "@/components/CourseCard";

interface CourseGridProps {
  courses: Course[];
}

export default function CourseGrid({ courses }: CourseGridProps) {
  if (courses.length === 0) {
    return (
      <div className="flex flex-col items-center gap-3 rounded-2xl border border-brand-plum bg-brand-surface px-6 py-16 text-center">
        <BookOpen className="text-brand-blush" size={32} />
        <p className="font-fredoka text-lg text-white">
          Todavía no hay cursos por acá
        </p>
        <p className="font-dmsans text-sm text-gray-400">
          Estamos sumando nuevas oportunidades. ¡Volvé a pasar pronto!
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {courses.map((course) => (
        <CourseCard key={course.id} course={course} />
      ))}
    </div>
  );
}
