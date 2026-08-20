# GMET — Cursos y Oportunidades

Sitio de cursos y oportunidades de formación en tecnología para mujeres de GIDAS, UTN La Plata. Construido con Next.js 14 (App Router), TypeScript, Tailwind CSS y Supabase.

## Stack

- Next.js 14 (App Router) + TypeScript estricto
- Tailwind CSS
- Supabase (Postgres + RLS) como base de datos
- Lucide React para íconos

## 1. Configurar Supabase

1. Creá una cuenta y un proyecto nuevo en [supabase.com](https://supabase.com/dashboard).
2. En el dashboard del proyecto, andá a **SQL Editor** → **New query** y pegá el siguiente script completo (crea la tabla `courses` y las políticas de RLS):

   ```sql
   -- Extensión para generar uuids
   create extension if not exists "pgcrypto";

   -- Tabla courses
   create table if not exists public.courses (
     id uuid primary key default gen_random_uuid(),
     title text not null,
     description text not null,
     provider text not null,
     category text not null,
     registration_deadline date,
     access_url text not null,
     is_active boolean not null default true,
     created_at timestamptz not null default now()
   );

   -- Habilitar RLS
   alter table public.courses enable row level security;

   -- SELECT: público, cualquiera puede leer
   create policy "courses_select_public"
     on public.courses
     for select
     using (true);

   -- INSERT/UPDATE/DELETE: permisivas por ahora (el panel admin usa un
   -- password simple, no Supabase Auth). Cuando se implemente auth real,
   -- restringir estas policies a `to authenticated`.
   create policy "courses_insert_permissive"
     on public.courses
     for insert
     with check (true);

   create policy "courses_update_permissive"
     on public.courses
     for update
     using (true)
     with check (true);

   create policy "courses_delete_permissive"
     on public.courses
     for delete
     using (true);
   ```

3. Ejecutá el script (**Run**).
4. Andá a **Project Settings** → **API**. De ahí vas a necesitar:
   - **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
   - **Project API keys** → la clave `anon` / `public` → `NEXT_PUBLIC_SUPABASE_ANON_KEY`

## 2. Variables de entorno

Copiá `.env.local` (o creá uno nuevo) con estas tres variables:

```
NEXT_PUBLIC_SUPABASE_URL=https://tu-proyecto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu-anon-key
ADMIN_PASSWORD=elegí-una-contraseña-para-el-panel-admin
```

- `NEXT_PUBLIC_SUPABASE_URL` y `NEXT_PUBLIC_SUPABASE_ANON_KEY`: salen del paso anterior. Son públicas (van al bundle del navegador), la seguridad de escritura depende de las policies de RLS.
- `ADMIN_PASSWORD`: la contraseña para entrar al panel `/admin`. **No** lleva el prefijo `NEXT_PUBLIC_`, así que nunca se expone al navegador — se valida en el servidor.

## 3. Correr en local

```bash
npm install
npm run dev
```

Abrí [http://localhost:3000](http://localhost:3000) para el sitio público.

## 4. Deployar en Vercel

1. Subí el repo a GitHub (u otro proveedor soportado).
2. En [vercel.com/new](https://vercel.com/new), importá el repositorio.
3. En **Environment Variables**, cargá las tres variables del paso 2 (`NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `ADMIN_PASSWORD`).
4. Deploy. Vercel detecta Next.js automáticamente, no hace falta configuración adicional.
5. Si más adelante cambiás alguna variable de entorno, hay que volver a deployar (Vercel → Deployments → Redeploy) para que tome el nuevo valor.

## 5. Acceder al panel admin

1. Andá a `/admin/login` en el sitio deployado (o `http://localhost:3000/admin/login` en local).
2. Ingresá la contraseña configurada en `ADMIN_PASSWORD`.
3. Vas a quedar autenticado mientras la pestaña siga abierta (la sesión se guarda en `sessionStorage`, no persiste al cerrar el navegador).
4. Desde `/admin` podés cargar cursos nuevos, editar los existentes y eliminarlos.

## Estructura del proyecto

```
src/
  app/
    page.tsx              → página pública de cursos
    loading.tsx            → skeleton mientras cargan los cursos
    error.tsx               → pantalla de error genérica
    admin/
      page.tsx             → panel admin (protegido por sessionStorage)
      login/page.tsx        → login del panel admin
  components/               → CourseCard, CourseGrid, StatusBadge, etc.
  lib/
    supabase.ts             → cliente de Supabase + SQL del esquema
    courseUtils.ts          → lógica de estados de un curso (activo/por vencer/vencido)
  types/
    course.ts                → tipo Course
```
