"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Trash2, Calendar, Plus, Minus, ShoppingCart } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { DatePickerWithRange } from "@/components/date-range-picker";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Product, Categories } from "@/lib/types";
import { useCart } from "@/contexts/cart-context";
import { formatARS, formatUSD } from "@/lib/prices";
import { dbCreateQuote } from "@/lib/actions";
import type { DateRange } from "react-day-picker";

export default function QuotePage({
  products,
  categories,
  exchangeRate = 1,
}: {
  products: Product[];
  categories: Categories;
  exchangeRate?: number;
}) {
  const { items, hydrated, updateQuantity, removeItem, clearCart } = useCart();

  const [dateRange, setDateRange] = useState<DateRange | undefined>(undefined);

  const [customerInfo, setCustomerInfo] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
    notes: "",
  });

  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleQuantityChange = (productId: string, delta: number) => {
    const item = items.find((i) => i.productId === productId);
    if (!item) return;
    const product = products.find((p) => p.id === productId);
    const maxStock = product?.stock ?? 1;
    const next = Math.min(maxStock, Math.max(1, item.quantity + delta));
    updateQuantity(productId, next);
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setCustomerInfo((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmitQuote = async () => {
    if (items.length === 0) {
      alert("Agregá al menos un producto al presupuesto antes de enviarlo.");
      return;
    }
    if (!customerInfo.name || !customerInfo.email || !customerInfo.phone) {
      alert("Por favor completá tu nombre, email y teléfono.");
      return;
    }

    setSubmitting(true);
    try {
      await dbCreateQuote({
        customer: customerInfo,
        items: items.map((i) => ({
          productId: i.productId,
          quantity: i.quantity,
        })),
        startDate: dateRange?.from ?? null,
        endDate: dateRange?.to ?? null,
        totalDays: rentalDays,
      });
      setSubmitted(true);
      clearCart();
    } catch (err) {
      console.error("Error al guardar el presupuesto:", err);
      alert("Hubo un error al enviar el presupuesto. Intentá de nuevo.");
    } finally {
      setSubmitting(false);
    }
  };

  // Días de alquiler
  const rentalDays =
    dateRange?.from && dateRange?.to
      ? Math.max(
          1,
          Math.ceil(
            (dateRange.to.getTime() - dateRange.from.getTime()) /
              (1000 * 60 * 60 * 24),
          ),
        )
      : 1;

  // Subtotal diario
  const dailySubtotal = items.reduce((sum, item) => {
    const product = products.find((p) => p.id === item.productId);
    return sum + (product ? product.price * item.quantity : 0);
  }, 0);

  const total = dailySubtotal * rentalDays;

  const formatPrice = (usd: number) =>
    exchangeRate > 1 ? formatARS(usd, exchangeRate) : formatUSD(usd);

  if (submitted) {
    return (
      <div className="container px-4 py-16 md:px-6 text-center max-w-md mx-auto">
        <div className="mb-6 text-5xl">✅</div>
        <h1 className="text-3xl font-bold mb-3">¡Presupuesto enviado!</h1>
        <p className="text-muted-foreground mb-8">
          Recibimos tu solicitud. Nos pondremos en contacto a la brevedad a{" "}
          <strong>{customerInfo.email}</strong>.
        </p>
        <Button asChild>
          <Link href="/catalog/all">Seguir viendo el catálogo</Link>
        </Button>
      </div>
    );
  }

  return (
    <div>
      <main className="flex-1">
        <div className="container px-4 py-6 md:px-6 md:py-8">
          <div className="mb-6">
            <h1 className="text-3xl font-bold tracking-tight">
              Solicitud de Presupuesto
            </h1>
            <p className="text-muted-foreground">
              Revisá los equipos seleccionados, el período de alquiler y
              completá tus datos.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Columna principal */}
            <div className="lg:col-span-2 space-y-6">
              {/* Equipos seleccionados */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex justify-between items-center">
                    <span>Equipos seleccionados</span>
                    <Button variant="outline" size="sm" asChild>
                      <Link href="/catalog/all">
                        <Plus className="h-4 w-4 mr-2" />
                        Agregar equipos
                      </Link>
                    </Button>
                  </CardTitle>
                  <CardDescription>
                    Equipos que querés incluir en el presupuesto
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {items.length === 0 ? (
                    <div className="text-center py-10 space-y-4">
                      <ShoppingCart className="mx-auto h-12 w-12 text-muted-foreground/40" />
                      <p className="text-muted-foreground">
                        Todavía no agregaste equipos al presupuesto.
                      </p>
                      <Button asChild variant="outline">
                        <Link href="/catalog/all">Ver catálogo</Link>
                      </Button>
                    </div>
                  ) : (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Producto</TableHead>
                          <TableHead>Precio/día</TableHead>
                          <TableHead>Cantidad</TableHead>
                          <TableHead>Subtotal/día</TableHead>
                          <TableHead className="w-[50px]"></TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {items.map((item) => {
                          const product = products.find(
                            (p) => p.id === item.productId,
                          );
                          if (!product) return null;

                          return (
                            <TableRow key={item.productId}>
                              <TableCell>
                                <Link
                                  href={`/catalog/product/${product.id}`}
                                  className="hover:underline"
                                >
                                  <div className="font-medium">
                                    {product.name}
                                  </div>
                                  <div className="text-sm text-muted-foreground">
                                    {product.brand}
                                  </div>
                                </Link>
                              </TableCell>
                              <TableCell>
                                {formatPrice(product.price)}
                                <span className="text-muted-foreground text-xs">
                                  /día
                                </span>
                              </TableCell>
                              <TableCell>
                                <div className="flex items-center gap-1">
                                  <Button
                                    variant="outline"
                                    size="icon"
                                    className="h-7 w-7"
                                    onClick={() =>
                                      handleQuantityChange(item.productId, -1)
                                    }
                                    disabled={item.quantity <= 1}
                                  >
                                    <Minus className="h-3 w-3" />
                                  </Button>
                                  <span className="w-6 text-center text-sm font-medium">
                                    {item.quantity}
                                  </span>
                                  <Button
                                    variant="outline"
                                    size="icon"
                                    className="h-7 w-7"
                                    onClick={() =>
                                      handleQuantityChange(item.productId, 1)
                                    }
                                    disabled={item.quantity >= product.stock}
                                  >
                                    <Plus className="h-3 w-3" />
                                  </Button>
                                </div>
                                <p className="text-xs text-muted-foreground mt-1">
                                  {product.stock} disponibles
                                </p>
                              </TableCell>
                              <TableCell>
                                {formatPrice(product.price * item.quantity)}
                              </TableCell>
                              <TableCell>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => removeItem(item.productId)}
                                >
                                  <Trash2 className="h-4 w-4 text-muted-foreground" />
                                </Button>
                              </TableCell>
                            </TableRow>
                          );
                        })}
                      </TableBody>
                    </Table>
                  )}
                </CardContent>
              </Card>

              {/* Período de alquiler */}
              <Card>
                <CardHeader>
                  <CardTitle>Período de alquiler</CardTitle>
                  <CardDescription>
                    Seleccioná las fechas de inicio y fin del alquiler
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col md:flex-row gap-4 items-start">
                    <div className="w-full md:w-auto">
                      <DatePickerWithRange
                        date={dateRange}
                        setDate={setDateRange}
                      />
                    </div>
                    <div className="flex-1 space-y-2">
                      <div className="flex justify-between">
                        <span>Duración del alquiler:</span>
                        <Badge variant="outline">
                          {rentalDays} día{rentalDays !== 1 ? "s" : ""}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Los equipos estarán disponibles para retiro a partir de
                        la fecha de inicio y deben ser devueltos antes de la
                        fecha de fin.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Datos del cliente */}
              <Card>
                <CardHeader>
                  <CardTitle>Tus datos</CardTitle>
                  <CardDescription>
                    Completá tus datos de contacto para recibir el presupuesto
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">
                        Nombre completo{" "}
                        <span className="text-destructive">*</span>
                      </Label>
                      <Input
                        id="name"
                        name="name"
                        value={customerInfo.name}
                        onChange={handleInputChange}
                        placeholder="Juan García"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">
                        Email <span className="text-destructive">*</span>
                      </Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={customerInfo.email}
                        onChange={handleInputChange}
                        placeholder="juan@ejemplo.com"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">
                        Teléfono <span className="text-destructive">*</span>
                      </Label>
                      <Input
                        id="phone"
                        name="phone"
                        value={customerInfo.phone}
                        onChange={handleInputChange}
                        placeholder="+54 11 1234-5678"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="company">Empresa (opcional)</Label>
                      <Input
                        id="company"
                        name="company"
                        value={customerInfo.company}
                        onChange={handleInputChange}
                        placeholder="Nombre de la empresa"
                      />
                    </div>
                    <div className="space-y-2 md:col-span-2">
                      <Label htmlFor="notes">Notas adicionales</Label>
                      <Input
                        id="notes"
                        name="notes"
                        value={customerInfo.notes}
                        onChange={handleInputChange}
                        placeholder="Requerimientos especiales, preguntas, etc."
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Resumen */}
            <div>
              <Card className="sticky top-6">
                <CardHeader>
                  <CardTitle>Resumen</CardTitle>
                  <CardDescription>
                    Detalle de tu solicitud de presupuesto
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <div className="text-sm font-medium">
                        Período de alquiler
                      </div>
                      <div className="flex items-center mt-1 gap-2">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">
                          {dateRange?.from
                            ? dateRange.from.toLocaleDateString("es-AR")
                            : "Fecha inicio"}
                          {" → "}
                          {dateRange?.to
                            ? dateRange.to.toLocaleDateString("es-AR")
                            : "Fecha fin"}
                        </span>
                      </div>
                      <div className="text-xs text-muted-foreground mt-1">
                        {rentalDays} día{rentalDays !== 1 ? "s" : ""}
                      </div>
                    </div>

                    <Separator />

                    <div>
                      <div className="text-sm font-medium mb-2">
                        Equipos ({items.reduce((s, i) => s + i.quantity, 0)}{" "}
                        unidades)
                      </div>
                      {items.length === 0 ? (
                        <p className="text-sm text-muted-foreground">
                          Sin equipos aún.{" "}
                          <Link href="/catalog/all" className="underline">
                            Ver catálogo
                          </Link>
                        </p>
                      ) : (
                        <ul className="space-y-1.5">
                          {items.map((item) => {
                            const product = products.find(
                              (p) => p.id === item.productId,
                            );
                            if (!product) return null;
                            return (
                              <li
                                key={item.productId}
                                className="flex justify-between text-sm"
                              >
                                <span className="text-muted-foreground">
                                  {product.name}{" "}
                                  <span className="font-medium text-foreground">
                                    ×{item.quantity}
                                  </span>
                                </span>
                                <span>
                                  {formatPrice(product.price * item.quantity)}
                                </span>
                              </li>
                            );
                          })}
                        </ul>
                      )}
                    </div>

                    <Separator />

                    <div className="space-y-1.5">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">
                          Subtotal/día:
                        </span>
                        <span>{formatPrice(dailySubtotal)}</span>
                      </div>
                      <div className="flex justify-between text-sm text-muted-foreground">
                        <span>Duración:</span>
                        <span>
                          × {rentalDays} día{rentalDays !== 1 ? "s" : ""}
                        </span>
                      </div>
                      <Separator className="my-2" />
                      <div className="flex justify-between font-semibold text-lg">
                        <span>Total estimado:</span>
                        <span>{formatPrice(total)}</span>
                      </div>
                      {exchangeRate > 1 && total > 0 && (
                        <div className="text-xs text-muted-foreground text-right">
                          ({formatUSD(total)} USD)
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex flex-col gap-2">
                  <Button
                    className="w-full"
                    onClick={handleSubmitQuote}
                    disabled={submitting || (hydrated && items.length === 0)}
                  >
                    {submitting
                      ? "Enviando..."
                      : "Enviar solicitud de presupuesto"}
                  </Button>
                  <Button variant="outline" className="w-full" asChild>
                    <Link href="/catalog/all">Seguir agregando equipos</Link>
                  </Button>
                </CardFooter>
              </Card>
            </div>
          </div>
        </div>
      </main>
      <footer className="border-t">
        <div className="container flex flex-col gap-2 py-4 md:h-16 md:flex-row md:items-center md:py-0 px-4 md:px-6">
          <div className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} ProSonus. Todos los derechos
            reservados.
          </div>
          <nav className="md:ml-auto flex gap-4 sm:gap-6">
            <Link
              href="#"
              className="text-xs hover:underline underline-offset-4"
            >
              Términos y condiciones
            </Link>
            <Link
              href="#"
              className="text-xs hover:underline underline-offset-4"
            >
              Privacidad
            </Link>
          </nav>
        </div>
      </footer>
    </div>
  );
}
