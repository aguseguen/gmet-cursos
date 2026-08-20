"use client";

import { AlertTriangle } from "lucide-react";

export default function Error({ reset }: { reset: () => void }) {
  return (
    <main className="flex min-h-screen items-center justify-center bg-brand-dark px-4">
      <div className="flex max-w-sm flex-col items-center gap-3 rounded-2xl border border-brand-plum bg-brand-surface p-8 text-center">
        <AlertTriangle className="text-brand-hot" size={32} />
        <h2 className="font-fredoka text-xl text-white">Algo salió mal</h2>
        <p className="font-dmsans text-sm text-gray-400">
          No pudimos mostrar esta página. Probá de nuevo en unos minutos.
        </p>
        <button
          type="button"
          onClick={reset}
          className="mt-2 rounded-lg bg-brand-pink px-4 py-2 font-dmsans text-sm font-medium text-white transition-colors hover:bg-brand-hot"
        >
          Reintentar
        </button>
      </div>
    </main>
  );
}
