"use client";

import {
  createContext,
  useContext,
  useState,
  useRef,
  useCallback,
  useEffect,
} from "react";
import { useCart } from "@/contexts/cart-context";
import { dbGetProducts } from "@/lib/actions";
import { Product } from "@/lib/types";

export interface Message {
  role: "user" | "assistant";
  content: string;
}

interface AssistantContextType {
  isOpen: boolean;
  open: () => void;
  close: () => void;
  messages: Message[];
  streaming: boolean;
  input: string;
  setInput: (v: string) => void;
  submit: () => void;
  bottomRef: React.RefObject<HTMLDivElement | null>;
  inputRef: React.RefObject<HTMLInputElement | null>;
}

const AssistantContext = createContext<AssistantContextType | null>(null);

export function AssistantProvider({ children }: { children: React.ReactNode }) {
  const { items } = useCart();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [streaming, setStreaming] = useState(false);
  const [input, setInput] = useState("");
  const [products, setProducts] = useState<Product[]>([]);

  const abortRef = useRef<AbortController | null>(null);
  const initialCallMade = useRef(false);
  const bottomRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  // Fetch the full catalog once on mount
  useEffect(() => {
    dbGetProducts().then((p) => setProducts(p as Product[]));
  }, []);

  const buildCartContext = useCallback(() => {
    const cartItems = items.map((item) => {
      const p = products.find((p) => p.id === item.productId);
      return {
        name: p?.name ?? item.productId,
        brand: p?.brand ?? "—",
        category: p?.category ?? "—",
        quantity: item.quantity,
        specs: p?.specs ?? undefined,
      };
    });

    const catalog: Record<
      string,
      { name: string; brand: string; specs?: string; stock: number }[]
    > = {};
    for (const p of products) {
      if (!catalog[p.category]) catalog[p.category] = [];
      catalog[p.category].push({
        name: p.name,
        brand: p.brand,
        specs: p.specs ?? undefined,
        stock: p.stock,
      });
    }

    return { items: cartItems, catalog };
  }, [items, products]);

  const send = useCallback(
    async (userText: string, history: Message[]) => {
      setStreaming(true);
      abortRef.current = new AbortController();

      const nextHistory: Message[] = userText
        ? [...history, { role: "user" as const, content: userText }]
        : history;

      if (userText) setMessages(nextHistory);

      setMessages((prev) => [
        ...(userText ? nextHistory : prev),
        { role: "assistant", content: "" },
      ]);

      try {
        const res = await fetch("/api/setup-assistant", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          signal: abortRef.current.signal,
          body: JSON.stringify({
            messages: [
              ...nextHistory,
              ...(nextHistory.length === 0
                ? [
                    {
                      role: "user" as const,
                      content:
                        "Analizá mi setup actual y comenzá el diagnóstico.",
                    },
                  ]
                : []),
            ],
            cartContext: buildCartContext(),
          }),
        });

        if (!res.ok || !res.body) throw new Error("Error del servidor");

        const reader = res.body.getReader();
        const decoder = new TextDecoder();

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          const chunk = decoder.decode(value, { stream: true });
          setMessages((prev) => {
            const updated = [...prev];
            const last = updated[updated.length - 1];
            updated[updated.length - 1] = {
              ...last,
              content: last.content + chunk,
            };
            return updated;
          });
        }
      } catch (err: unknown) {
        if (err instanceof Error && err.name === "AbortError") return;
        setMessages((prev) => {
          const updated = [...prev];
          updated[updated.length - 1] = {
            role: "assistant",
            content:
              "❌ Hubo un error al conectar con el asistente. Verificá que OPENAI_API_KEY esté configurada.",
          };
          return updated;
        });
      } finally {
        setStreaming(false);
        setTimeout(() => inputRef.current?.focus(), 50);
      }
    },
    [buildCartContext],
  );

  const open = useCallback(() => {
    setIsOpen(true);
    if (!initialCallMade.current) {
      initialCallMade.current = true;
      send("", []);
    }
  }, [send]);

  const close = useCallback(() => {
    abortRef.current?.abort();
    setIsOpen(false);
  }, []);

  const submit = useCallback(() => {
    const text = input.trim();
    if (!text || streaming) return;
    setInput("");
    send(
      text,
      messages.filter((m) => m.content !== "" || m.role === "user"),
    );
  }, [input, streaming, messages, send]);

  // Auto-scroll whenever messages update
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <AssistantContext.Provider
      value={{
        isOpen,
        open,
        close,
        messages,
        streaming,
        input,
        setInput,
        submit,
        bottomRef,
        inputRef,
      }}
    >
      {children}
    </AssistantContext.Provider>
  );
}

export function useAssistant() {
  const ctx = useContext(AssistantContext);
  if (!ctx) throw new Error("useAssistant must be used within AssistantProvider");
  return ctx;
}
