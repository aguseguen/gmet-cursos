import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import type { CourseExtracted } from "@/types/course";

const CATEGORIES = [
  "Backend",
  "Frontend",
  "Data Analytics",
  "IA / ML",
  "Ciberseguridad",
  "Diseño UX",
  "Project Management",
  "Cloud",
  "Otro",
];

function buildPrompt(text: string) {
  return `Sos un asistente que extrae información de cursos y oportunidades de formación.
Del siguiente texto, extraé los campos en formato JSON.
Si un campo no está presente en el texto, usá null.
Respondé ÚNICAMENTE con el JSON, sin texto adicional, sin markdown, sin backticks.

Campos a extraer:
{
  "title": string | null,
  "description": string | null,
  "provider": string | null,
  "category": string | null,
  "registration_deadline": string | null,
  "access_url": string | null,
  "age_range": string | null
}

Categorías válidas (usá la más cercana o null si no aplica):
${CATEGORIES.join(", ")}

registration_deadline: string | null — si encontrás una fecha, convertila a formato YYYY-MM-DD. Por ejemplo: "30 de octubre de 2026" → "2026-10-30"

access_url: string | null — si la URL no empieza con http:// o https://, agregale https:// al principio

Texto:
${text}`;
}

function parseExtractedJson(raw: string): CourseExtracted {
  const cleaned = raw
    .trim()
    .replace(/^```(?:json)?/i, "")
    .replace(/```$/, "")
    .trim();

  const parsed = JSON.parse(cleaned);

  return {
    title: parsed.title ?? null,
    description: parsed.description ?? null,
    provider: parsed.provider ?? null,
    category: parsed.category ?? null,
    registration_deadline: parsed.registration_deadline ?? null,
    access_url: parsed.access_url ?? null,
    age_range: parsed.age_range ?? null,
  };
}

export async function POST(request: Request) {
  let body: { text?: unknown; url?: unknown };

  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { success: false, error: "El cuerpo de la solicitud no es JSON válido." },
      { status: 400 }
    );
  }

  const url = typeof body?.url === "string" ? body.url.trim() : "";
  let text = typeof body?.text === "string" ? body.text.trim() : "";

  if (url) {
    if (!/^https?:\/\//i.test(url)) {
      return NextResponse.json(
        { success: false, error: "URL inválida" },
        { status: 400 }
      );
    }

    try {
      const jinaResponse = await fetch(`https://r.jina.ai/${url}`, {
        headers: { Accept: "text/plain" },
      });

      const pageText = jinaResponse.ok
        ? (await jinaResponse.text()).trim()
        : "";

      if (!pageText) {
        return NextResponse.json(
          {
            success: false,
            error:
              "No se pudo leer el contenido de la página. El sitio puede estar bloqueando el acceso.",
          },
          { status: 502 }
        );
      }

      text = pageText;
    } catch {
      return NextResponse.json(
        {
          success: false,
          error:
            "No se pudo leer el contenido de la página. El sitio puede estar bloqueando el acceso.",
        },
        { status: 502 }
      );
    }
  }

  if (!text) {
    return NextResponse.json(
      { success: false, error: "Falta el texto a analizar." },
      { status: 400 }
    );
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      {
        success: false,
        error: "Falta configurar GEMINI_API_KEY en el servidor.",
      },
      { status: 500 }
    );
  }

  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-3.6-flash" });

    const result = await model.generateContent(buildPrompt(text));
    const raw = result.response.text();

    let data: CourseExtracted;
    try {
      data = parseExtractedJson(raw);
    } catch {
      return NextResponse.json(
        {
          success: false,
          error:
            "No se pudo interpretar la respuesta de la IA. Probá de nuevo.",
        },
        { status: 502 }
      );
    }

    return NextResponse.json({ success: true, data });
  } catch (err) {
    const message =
      err instanceof Error
        ? err.message
        : "Error desconocido al consultar la IA.";
    return NextResponse.json(
      { success: false, error: `No se pudo procesar el texto: ${message}` },
      { status: 502 }
    );
  }
}
