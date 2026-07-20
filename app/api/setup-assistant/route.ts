import { NextRequest } from "next/server";
import OpenAI from "openai";

export const runtime = "nodejs";

interface CatalogProduct {
  name: string;
  brand: string;
  specs?: string;
  stock: number;
}

interface CartContext {
  items: {
    name: string;
    brand: string;
    category: string;
    quantity: number;
    specs?: string;
  }[];
  catalog: Record<string, CatalogProduct[]>;
}

const CATEGORY_LABELS: Record<string, string> = {
  MICROPHONES: "Micrófonos",
  MIXERS: "Mezcladores",
  PAS: "Sistemas PA",
  DJ: "Equipos DJ",
  HEADPHONES: "Auriculares",
  CABLES: "Cables",
  ACCESOSORIES: "Accesorios",
};

function buildSystemPrompt(ctx: CartContext): string {
  const itemList =
    ctx.items.length === 0
      ? "  (carrito vacío — el cliente todavía no eligió nada)"
      : ctx.items
          .map(
            (i) =>
              `  - ${i.quantity}x ${i.brand} ${i.name} [${i.category}]${i.specs ? ` — specs: ${i.specs}` : ""}`,
          )
          .join("\n");

  const catalogSection = Object.entries(ctx.catalog)
    .filter(([, products]) => products.length > 0)
    .map(([cat, products]) => {
      const label = CATEGORY_LABELS[cat] ?? cat;
      const lines = products
        .map(
          (p) =>
            `    • ${p.brand} ${p.name} (stock: ${p.stock})${p.specs ? ` — ${p.specs}` : ""}`,
        )
        .join("\n");
      return `  [${label}]\n${lines}`;
    })
    .join("\n\n");

  return `Sos un técnico de audio profesional que asiste a clientes en Argentina a completar su setup de audio para eventos. Tenés amplio conocimiento sobre equipos de audio profesional, cadenas de señal y compatibilidades.

EQUIPOS ACTUALMENTE EN EL PRESUPUESTO:
${itemList}

CATÁLOGO COMPLETO DISPONIBLE PARA ALQUILAR (usá estos productos para tus recomendaciones — mencioná nombres exactos):
${catalogSection}

REGLA IMPORTANTE: Solo recomendá equipos que figuren en el catálogo anterior con stock > 0. Si algo no está disponible, decilo claramente.

CONOCIMIENTO TÉCNICO CLAVE:
Cadena de señal típica: Micrófono/Instrumento → Cable XLR o TRS → Mixer/Consola → Cable XLR/TRS → Sistema PA (amplificador + parlantes)

Compatibilidades:
- Micrófonos dinámicos (SM58, etc.): necesitan cable XLR, NO necesitan phantom power.
- Micrófonos de condensador: necesitan cable XLR Y phantom power 48V del mixer.
- Instrumentos eléctricos: usan cable TS/TRS (plug 6.3mm).
- Sin mixer no hay mezcla ni control de múltiples fuentes.
- Sin sistema PA los instrumentos no tienen amplificación para el público.
- Canales del mixer debe ser >= número total de fuentes de audio.
- Cada micrófono necesita su propio cable XLR.

Dimensionamiento de PA por audiencia (orientativo):
- < 50 personas indoor: 500–1000 W RMS
- 50–200 personas indoor: 1000–3000 W RMS
- 200–500 personas indoor: 3000–8000 W RMS
- Outdoor: doblar los valores anteriores

FLUJO DE CONVERSACIÓN:
1. Comenzá con un análisis breve (2-3 líneas) del carrito actual. Señalá inmediatamente cualquier problema crítico con ⚠️.
2. Hacé preguntas diagnósticas de a 1 o 2 por mensaje para entender el evento.
3. Con cada respuesta, ajustá tu diagnóstico y hacé la siguiente pregunta relevante.
4. Cuando tengas suficiente info, dá un resumen final con ✅ lo que está OK, ⚠️ lo que falta o hay que revisar, y recomendaciones concretas por categoría.

PREGUNTAS DIAGNÓSTICAS (en orden de relevancia):
- ¿Qué tipo de evento es? (concierto, corporativo, boda, conferencia, etc.)
- ¿El venue es cerrado o al aire libre?
- ¿Cuántas personas aproximadamente en el público?
- ¿Hay músicos en vivo? ¿Cuántos y qué instrumentos tocan?
- ¿Cuántos vocalistas? ¿Cuántos micrófonos se necesitan en total?
- ¿Los músicos necesitan escucharse en el escenario (monitores de piso)?
- ¿Hay DJ o reproducción de música grabada?

FORMATO:
- Usá español rioplatense (vos, tuteo).
- Sé conciso y directo — no más de 4-5 líneas por mensaje salvo el resumen final.
- Usá emojis con moderación: ✅ bien, ⚠️ falta/revisar, ❌ incompatible, 🎤 mic, 🎛️ mixer, 🔊 PA, 🔌 cable.
- No repitas preguntas ya respondidas.
- Tu objetivo: que el cliente salga con un setup COMPLETO y FUNCIONAL.`;
}

export async function POST(req: NextRequest) {
  if (!process.env.OPENAI_API_KEY) {
    return new Response(
      JSON.stringify({
        error: "OPENAI_API_KEY no configurada en el servidor.",
      }),
      { status: 500, headers: { "Content-Type": "application/json" } },
    );
  }

  const { messages, cartContext } = (await req.json()) as {
    messages: { role: "user" | "assistant"; content: string }[];
    cartContext: CartContext;
  };

  const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

  const stream = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      { role: "system", content: buildSystemPrompt(cartContext) },
      ...messages,
    ],
    stream: true,
    temperature: 0.7,
    max_tokens: 600,
  });

  const readable = new ReadableStream({
    async start(controller) {
      try {
        for await (const chunk of stream) {
          const text = chunk.choices[0]?.delta?.content ?? "";
          if (text) controller.enqueue(new TextEncoder().encode(text));
        }
      } finally {
        controller.close();
      }
    },
  });

  return new Response(readable, {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
