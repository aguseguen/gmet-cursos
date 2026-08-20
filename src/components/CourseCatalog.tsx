"use client";

import { useMemo, useState } from "react";
import type { Course } from "@/types/course";
import CourseGrid from "@/components/CourseGrid";

interface CourseCatalogProps {
  courses: Course[];
}

const ALL_CATEGORIES = "Todos";

export default function CourseCatalog({ courses }: CourseCatalogProps) {
  const categories = useMemo(
    () => [ALL_CATEGORIES, ...Array.from(new Set(courses.map((c) => c.category)))],
    [courses]
  );

  const [selectedCategory, setSelectedCategory] = useState(ALL_CATEGORIES);

  const filteredCourses = useMemo(
    () =>
      selectedCategory === ALL_CATEGORIES
        ? courses
        : courses.filter((c) => c.category === selectedCategory),
    [courses, selectedCategory]
  );

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap gap-2">
        {categories.map((category) => {
          const isSelected = category === selectedCategory;
          return (
            <button
              key={category}
              type="button"
              onClick={() => setSelectedCategory(category)}
              className={`rounded-full px-3.5 py-1.5 font-dmsans text-sm font-medium transition-colors ${
                isSelected
                  ? "bg-brand-hot text-white"
                  : "bg-brand-surface text-brand-blush hover:bg-brand-plum"
              }`}
            >
              {category}
            </button>
          );
        })}
      </div>

      <CourseGrid courses={filteredCourses} />
    </div>
  );
}
