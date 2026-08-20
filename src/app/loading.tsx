import CourseCardSkeleton from "@/components/CourseCardSkeleton";

export default function Loading() {
  return (
    <main className="min-h-screen bg-brand-dark px-4 py-10 sm:px-8">
      <div className="mx-auto max-w-6xl">
        <header className="mb-10">
          <h1 className="font-fredoka text-3xl font-semibold text-white sm:text-4xl">
            GMET
          </h1>
          <p className="font-dmsans text-brand-blush">
            Cursos y Oportunidades
          </p>
        </header>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          <CourseCardSkeleton />
          <CourseCardSkeleton />
          <CourseCardSkeleton />
        </div>
      </div>
    </main>
  );
}
