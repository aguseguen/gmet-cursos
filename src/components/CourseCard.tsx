"use client";

import { useState } from "react";
import { Calendar, Users } from "lucide-react";
import type { Course } from "@/types/course";
import { getCourseStatus, parseDateOnly } from "@/lib/courseUtils";
import StatusBadge from "@/components/StatusBadge";

interface CourseCardProps {
  course: Course;
}

function formatDeadline(deadline: string) {
  return parseDateOnly(deadline).toLocaleDateString("es-AR", {
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

export default function CourseCard({ course }: CourseCardProps) {
  const status = getCourseStatus(course);
  const [showDescription, setShowDescription] = useState(false);

  return (
    <div
      className={`relative flex flex-col gap-3 rounded-2xl border border-brand-plum bg-brand-surface p-5 ${
        status === "expired" ? "opacity-50" : ""
      }`}
    >
      <div className="absolute right-4 top-4">
        <StatusBadge status={status} />
      </div>

      <div className="pr-24">
        <p className="font-dmsans text-xs text-brand-blush">
          {course.provider?.name}
        </p>
        <h3 className="font-fredoka text-xl text-white">{course.title}</h3>
      </div>

      <div>
        <p className="font-dmsans line-clamp-3 text-sm text-gray-300">
          {course.description}
        </p>
        <button
          type="button"
          onClick={() => setShowDescription(true)}
          className="mt-1 font-dmsans text-xs text-brand-pink hover:underline"
        >
          Ver más
        </button>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <span className="rounded-full bg-brand-plum px-2.5 py-1 text-xs font-medium font-dmsans text-brand-blush">
          {displayCategory(course)}
        </span>

        {course.age_range && (
          <span className="inline-flex items-center gap-1 text-xs font-dmsans text-gray-400">
            <Users className="text-white" size={12} />
            {course.age_range}
          </span>
        )}

        {course.registration_deadline && (
          <span className="inline-flex items-center gap-1 text-xs font-dmsans text-gray-400">
            <Calendar className="text-white" size={12} />
            {formatDeadline(course.registration_deadline)}
          </span>
        )}
      </div>

      <a
        href={course.access_url}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-2 inline-flex items-center justify-center rounded-lg bg-brand-pink px-4 py-2 font-dmsans text-sm font-medium text-white transition-colors hover:bg-brand-hot"
      >
        Acceder
      </a>

      {showDescription && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4">
          <div className="w-full max-w-lg rounded-2xl border border-brand-plum bg-brand-surface p-6">
            <h3 className="font-fredoka text-lg text-white">
              {course.title}
            </h3>
            <p className="mt-3 whitespace-pre-wrap font-dmsans text-sm text-gray-300">
              {course.description}
            </p>
            <div className="mt-5 flex justify-end">
              <button
                type="button"
                onClick={() => setShowDescription(false)}
                className="rounded-lg border border-brand-plum px-4 py-2 font-dmsans text-sm text-brand-blush transition-colors hover:bg-brand-plum"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
