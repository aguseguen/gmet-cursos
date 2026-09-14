"use client";

import { useState } from "react";
import { Link as LinkIcon, Loader2, Sparkles } from "lucide-react";
import type { CourseExtracted } from "@/types/course";

interface AICoursLoaderProps {
  onExtracted: (data: CourseExtracted) => void;
}

type InputMode = "text" | "url";

export default function AICoursLoader({ onExtracted }: AICoursLoaderProps) {
  const [mode, setMode] = useState<InputMode>("text");
  const [text, setText] = useState("");
  const [url, setUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const switchMode = (nextMode: InputMode) => {
    setMode(nextMode);
    setError(null);
  };

  const handleExtract = async () => {
    if (mode === "url" && !url.trim()) {
      setError("Pegá un link para analizar.");
      return;
    }
    if (mode === "text" && !text.trim()) {
      setError("Pegá un texto para analizar.");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/extract-course", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(
          mode === "url" ? { url: url.trim() } : { text: text.trim() }
        ),
      });

      const result = await response.json();

      if (!result.success) {
        setError(result.error ?? "No se pudo extraer la información.");
        return;
      }

      onExtracted(result.data as CourseExtracted);
    } catch {
      setError("No se pudo conectar con el servicio de IA. Probá de nuevo.");
    } finally {
      setIsLoading(false);
    }
  };

  const tabClass = (tab: InputMode) =>
    `rounded-lg px-3 py-1.5 font-dmsans text-sm font-medium transition-colors ${
      mode === tab
        ? "bg-brand-pink text-white"
        : "bg-brand-dark text-brand-blush hover:bg-brand-plum"
    }`;

  return (
    <section className="mb-10 rounded-2xl border border-brand-plum bg-brand-surface p-6">
      <h2 className="mb-4 flex items-center gap-2 font-fredoka text-xl text-white">
        <Sparkles className="text-brand-pink" size={20} />
        Cargar curso con IA
      </h2>

      <div className="mb-3 flex gap-2">
        <button
          type="button"
          onClick={() => switchMode("text")}
          className={tabClass("text")}
        >
          Pegar texto
        </button>
        <button
          type="button"
          onClick={() => switchMode("url")}
          className={tabClass("url")}
        >
          Pegar link
        </button>
      </div>

      {mode === "text" ? (
        <textarea
          rows={5}
          value={text}
          onChange={(event) => setText(event.target.value)}
          placeholder={
            'Pegá el texto con la información del curso. Por ejemplo:\n"Santander lanzó un bootcamp de Python para mujeres de 18 a 30 años, inscripción hasta el 15 de marzo en santander.com/bootcamp"'
          }
          className="w-full rounded-lg border border-brand-plum bg-brand-dark px-3 py-2 font-dmsans text-white outline-none focus:border-brand-pink"
        />
      ) : (
        <div>
          <div className="relative">
            <LinkIcon
              size={16}
              className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />
            <input
              type="url"
              value={url}
              onChange={(event) => setUrl(event.target.value)}
              placeholder="https://..."
              className="w-full rounded-lg border border-brand-plum bg-brand-dark py-2 pl-9 pr-3 font-dmsans text-white outline-none focus:border-brand-pink"
            />
          </div>
          <p className="mt-2 font-dmsans text-xs text-gray-400">
            El agente va a leer la página y extraer la información
            automáticamente
          </p>
        </div>
      )}

      {error && (
        <p className="mt-2 font-dmsans text-sm text-red-400">{error}</p>
      )}

      <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
        <button
          type="button"
          onClick={handleExtract}
          disabled={isLoading}
          className="inline-flex items-center gap-2 rounded-lg bg-brand-pink px-4 py-2 font-dmsans text-sm font-medium text-white transition-colors hover:bg-brand-hot disabled:opacity-60"
        >
          {isLoading ? (
            <>
              <Loader2 className="animate-spin" size={16} />
              {mode === "url" ? "Analizando página..." : "Analizando texto..."}
            </>
          ) : (
            <>
              <Sparkles size={16} />
              Extraer información
            </>
          )}
        </button>

        <p className="font-dmsans text-xs text-gray-400">
          La IA puede cometer errores. Revisá los campos antes de guardar.
        </p>
      </div>
    </section>
  );
}
