"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { verifyAdminPassword } from "./actions";

const ADMIN_AUTH_KEY = "gmet_admin_auth";

export default function AdminLoginPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setIsSubmitting(true);
    setError(null);

    const isValid = await verifyAdminPassword(password);

    if (!isValid) {
      setIsSubmitting(false);
      setError("Contraseña incorrecta.");
      return;
    }

    sessionStorage.setItem(ADMIN_AUTH_KEY, "true");
    router.push("/admin");
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-brand-dark px-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm rounded-2xl border border-brand-plum bg-brand-surface p-8"
      >
        <h1 className="font-fredoka text-2xl text-white">GMET Admin</h1>
        <p className="mb-6 font-dmsans text-sm text-brand-blush">
          Ingresá la contraseña para continuar
        </p>

        <label
          htmlFor="password"
          className="mb-2 block font-dmsans text-sm text-gray-300"
        >
          Contraseña
        </label>
        <input
          id="password"
          type="password"
          autoFocus
          required
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          className="mb-4 w-full rounded-lg border border-brand-plum bg-brand-dark px-3 py-2 font-dmsans text-white outline-none focus:border-brand-pink"
        />

        {error && (
          <p className="mb-4 font-dmsans text-sm text-red-400">{error}</p>
        )}

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full rounded-lg bg-brand-pink px-4 py-2 font-dmsans text-sm font-medium text-white transition-colors hover:bg-brand-hot disabled:opacity-60"
        >
          {isSubmitting ? "Verificando..." : "Ingresar"}
        </button>
      </form>
    </main>
  );
}
