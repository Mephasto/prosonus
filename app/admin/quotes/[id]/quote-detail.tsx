"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import type { DateRange } from "react-day-picker";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Separator } from "@/components/ui/separator";
import { DatePickerWithRange } from "@/components/date-range-picker";

import type { Quote, QuoteItem, QuoteStatus, Product } from "@/lib/types";
import { dbUpdateQuoteStatus, dbUpdateQuote } from "@/lib/actions";
import { type Status } from "@prisma/client";
import { formatUSD, formatARS } from "@/lib/prices";

// ─── Helpers ─────────────────────────────────────────────────────────────────

function StatusBadge({ status }: { status: QuoteStatus }) {
  if (status === "APPROVED") return <Badge variant="default">Aprobado</Badge>;
  if (status === "PENDING") return <Badge variant="outline">Pendiente</Badge>;
  return <Badge variant="destructive">Cancelado</Badge>;
}

/** Calcula días inclusivos entre dos fechas. Devuelve 0 si falta alguna. */
function calcDays(from?: Date, to?: Date): number {
  if (!from || !to) return 0;
  const ms = to.getTime() - from.getTime();
  return Math.max(1, Math.ceil(ms / (1000 * 60 * 60 * 24)) + 1);
}

// ─── Component ───────────────────────────────────────────────────────────────

export default function QuoteDetailPage({
  quote: initialQuote,
  products,
  exchangeRate,
}: {
  quote: Quote;
  products: Product[];
  exchangeRate: number;
}) {
  const [quote, setQuote] = useState<Quote>(initialQuote);

  // ── Estado del pedido ──
  const [selectedStatus, setSelectedStatus] = useState<Status>(
    initialQuote.status as Status,
  );
  const [statusSaving, setStatusSaving] = useState(false);
  const [statusSaved, setStatusSaved] = useState(false);

  // ── Período de alquiler ──
  const [dateRange, setDateRange] = useState<DateRange | undefined>(
    initialQuote.startDate || initialQuote.endDate
      ? {
          from: initialQuote.startDate
            ? new Date(initialQuote.startDate)
            : undefined,
          to: initialQuote.endDate ? new Date(initialQuote.endDate) : undefined,
        }
      : undefined,
  );
  const [periodSaving, setPeriodSaving] = useState(false);
  const [periodSaved, setPeriodSaved] = useState(false);

  // ── Datos derivados ──
  // items viene como Prisma.JsonValue; lo casteamos al tipo esperado
  const items = (quote.items as unknown as QuoteItem[]) ?? [];
  const totalDays = quote.totalDays;

  const subtotalPerDay = items.reduce((sum, item) => {
    const product = products.find((p) => p.id === item.productId);
    return sum + (product?.price ?? 0) * item.quantity;
  }, 0);
  const totalUSD = subtotalPerDay * totalDays;

  // ── Handlers ──
  const handleSaveStatus = async () => {
    setStatusSaving(true);
    setStatusSaved(false);
    try {
      const updated = await dbUpdateQuoteStatus(quote.id, selectedStatus);
      setQuote(updated as unknown as Quote);
      setStatusSaved(true);
      setTimeout(() => setStatusSaved(false), 3000);
    } finally {
      setStatusSaving(false);
    }
  };

  const handleSavePeriod = async () => {
    setPeriodSaving(true);
    setPeriodSaved(false);
    try {
      const newDays = calcDays(dateRange?.from, dateRange?.to);
      const updated = await dbUpdateQuote(quote.id, {
        startDate: dateRange?.from ?? null,
        endDate: dateRange?.to ?? null,
        totalDays: newDays,
      });
      setQuote(updated as unknown as Quote);
      setPeriodSaved(true);
      setTimeout(() => setPeriodSaved(false), 3000);
    } finally {
      setPeriodSaving(false);
    }
  };

  // ─── Render ───────────────────────────────────────────────────────────────
  return (
    <div className="container px-4 py-6 md:px-6 md:py-8 max-w-4xl mx-auto">
      {/* Breadcrumb / back */}
      <div className="mb-4">
        <Button variant="ghost" size="sm" asChild>
          <Link href="/admin">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Volver a presupuestos
          </Link>
        </Button>
      </div>

      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold tracking-tight">
          Presupuesto #{quote.id}
        </h1>
        <StatusBadge status={quote.status} />
      </div>

      <div className="space-y-6">
        {/* ── Estado del pedido ── */}
        <Card>
          <CardHeader>
            <CardTitle>Estado del pedido</CardTitle>
            <CardDescription>
              Actualizá el estado de este presupuesto.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Select
              value={selectedStatus}
              onValueChange={(v) => setSelectedStatus(v as Status)}
            >
              <SelectTrigger className="w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="PENDING">Pendiente</SelectItem>
                <SelectItem value="APPROVED">Aprobado</SelectItem>
                <SelectItem value="CANCELED">Cancelado</SelectItem>
              </SelectContent>
            </Select>
          </CardContent>
          <CardFooter className="flex items-center gap-3">
            <Button
              onClick={handleSaveStatus}
              disabled={statusSaving || selectedStatus === quote.status}
            >
              {statusSaving ? "Guardando..." : "Guardar estado"}
            </Button>
            {statusSaved && (
              <span className="text-sm text-green-600">✓ Guardado</span>
            )}
          </CardFooter>
        </Card>

        {/* ── Datos del cliente ── */}
        <Card>
          <CardHeader>
            <CardTitle>Datos del cliente</CardTitle>
          </CardHeader>
          <CardContent>
            <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-4 text-sm">
              <div>
                <dt className="text-muted-foreground mb-0.5">Nombre</dt>
                <dd className="font-medium">{quote.customer.name}</dd>
              </div>
              <div>
                <dt className="text-muted-foreground mb-0.5">Email</dt>
                <dd className="font-medium">{quote.customer.email}</dd>
              </div>
              <div>
                <dt className="text-muted-foreground mb-0.5">Teléfono</dt>
                <dd className="font-medium">{quote.customer.phone}</dd>
              </div>
              {quote.customer.company && (
                <div>
                  <dt className="text-muted-foreground mb-0.5">Empresa</dt>
                  <dd className="font-medium">{quote.customer.company}</dd>
                </div>
              )}
              {quote.customer.notes && (
                <div className="sm:col-span-2">
                  <dt className="text-muted-foreground mb-0.5">Notas</dt>
                  <dd className="font-medium whitespace-pre-wrap">
                    {quote.customer.notes}
                  </dd>
                </div>
              )}
            </dl>
          </CardContent>
        </Card>

        {/* ── Equipos solicitados ── */}
        <Card>
          <CardHeader>
            <CardTitle>Equipos solicitados</CardTitle>
            <CardDescription>
              {items.length} ítem{items.length !== 1 ? "s" : ""} · {totalDays}{" "}
              día{totalDays !== 1 ? "s" : ""} de alquiler
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Producto</TableHead>
                  <TableHead className="text-right">Cant.</TableHead>
                  <TableHead className="text-right">Precio/día</TableHead>
                  <TableHead className="text-right">Subtotal/día</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {items.map((item) => {
                  const product = products.find((p) => p.id === item.productId);
                  const linePrice = (product?.price ?? 0) * item.quantity;
                  return (
                    <TableRow key={item.productId}>
                      <TableCell>
                        {product ? (
                          <div>
                            <div className="font-medium">{product.name}</div>
                            <div className="text-xs text-muted-foreground">
                              {product.brand}
                            </div>
                          </div>
                        ) : (
                          <div>
                            <div className="font-medium font-mono text-muted-foreground text-xs">
                              {item.productId}
                            </div>
                            <div className="text-xs text-destructive">
                              Producto eliminado
                            </div>
                          </div>
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        {item.quantity}
                      </TableCell>
                      <TableCell className="text-right">
                        {product ? formatUSD(product.price) : "—"}
                      </TableCell>
                      <TableCell className="text-right">
                        {product ? formatUSD(linePrice) : "—"}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>

            <Separator className="my-4" />

            <div className="space-y-1.5 text-sm">
              <div className="flex justify-between text-muted-foreground">
                <span>
                  Subtotal/día × {totalDays} día{totalDays !== 1 ? "s" : ""}
                </span>
                <span>
                  {formatUSD(subtotalPerDay)} × {totalDays}
                </span>
              </div>
              <div className="flex justify-between font-semibold text-base">
                <span>Total</span>
                <div className="text-right">
                  <div>{formatUSD(totalUSD)}</div>
                  {exchangeRate > 1 && (
                    <div className="text-xs font-normal text-muted-foreground">
                      {formatARS(totalUSD, exchangeRate)}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* ── Período de alquiler ── */}
        <Card>
          <CardHeader>
            <CardTitle>Período de alquiler</CardTitle>
            <CardDescription>
              Modificá las fechas de inicio y fin del alquiler.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <DatePickerWithRange date={dateRange} setDate={setDateRange} />
            <p className="text-sm text-muted-foreground">
              Días calculados:{" "}
              <span className="font-semibold text-foreground">
                {calcDays(dateRange?.from, dateRange?.to)}
              </span>
            </p>
          </CardContent>
          <CardFooter className="flex items-center gap-3">
            <Button onClick={handleSavePeriod} disabled={periodSaving}>
              {periodSaving ? "Guardando..." : "Guardar período"}
            </Button>
            {periodSaved && (
              <span className="text-sm text-green-600">✓ Guardado</span>
            )}
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
