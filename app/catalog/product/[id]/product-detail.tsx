import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, Weight, Zap, FileText, Package } from "lucide-react";
import { AddToCartButton } from "@/components/add-to-cart-button";
import { Product } from "@/lib/types";
import { formatARS, formatUSD } from "@/lib/prices";

const CATEGORY_LABELS: Record<string, string> = {
  MICROPHONES: "Micrófonos",
  MIXERS: "Mezcladores",
  PAS: "Sistemas PA",
  DJ: "Equipos DJ",
  HEADPHONES: "Audífonos",
  CABLES: "Cables",
  ACCESOSORIES: "Accesorios",
};

export default function ProductDetail({
  product,
  exchangeRate = 1,
}: {
  product: Product;
  exchangeRate?: number;
}) {
  const weightKg = (product.weight / 1000).toFixed(2);
  const categoryLabel = CATEGORY_LABELS[product.category] ?? product.category;

  return (
    <div className="min-h-screen">
      <div className="container px-4 py-6 md:px-6 md:py-10 max-w-5xl mx-auto">
        <div className="mb-6">
          <Button variant="ghost" size="sm" asChild>
            <Link href={`/catalog/${product.category}`}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to {categoryLabel}
            </Link>
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
          <div className="aspect-square w-full rounded-xl overflow-hidden border border-white/10 bg-white/5">
            <img
              src={
                product.imageUrl
                  ? `/api/images/${product.imageUrl}`
                  : `/placeholder.svg?height=600&width=600&text=${encodeURIComponent(product.name)}`
              }
              alt={product.name}
              className={`object-cover w-full h-full ${!product.imageUrl ? "invert" : ""}`}
            />
          </div>

          <div className="flex flex-col gap-4">
            <div>
              <div className="flex items-start justify-between gap-2 mb-1">
                <h1 className="text-3xl font-bold tracking-tight">
                  {product.name}
                </h1>
                <Badge variant="secondary" className="mt-1 shrink-0">
                  {categoryLabel}
                </Badge>
              </div>
              <p className="text-lg text-muted-foreground">{product.brand}</p>
            </div>

            <Separator />

            <div className="flex items-baseline gap-3">
              {exchangeRate > 1 ? (
                <>
                  <span className="text-4xl font-bold">
                    {formatARS(product.price, exchangeRate)}
                  </span>
                  <div className="flex flex-col">
                    <span className="text-muted-foreground text-sm">/día</span>
                    <span className="text-muted-foreground text-xs">
                      {formatUSD(product.price)} USD
                    </span>
                  </div>
                </>
              ) : (
                <>
                  <span className="text-4xl font-bold">
                    {formatUSD(product.price)}
                  </span>
                  <span className="text-muted-foreground text-sm">/ day</span>
                </>
              )}
            </div>

            <Separator />

            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <Package className="h-4 w-4 mt-0.5 text-muted-foreground shrink-0" />
                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-wide mb-0.5">
                    Availability
                  </p>
                  <div className="flex items-center gap-2">
                    <p className="font-medium">
                      {product.stock} unit{product.stock !== 1 ? "s" : ""}{" "}
                      available
                    </p>
                    {product.stock === 0 && (
                      <Badge variant="destructive" className="text-xs">
                        Out of stock
                      </Badge>
                    )}
                    {product.stock > 0 && product.stock <= 3 && (
                      <Badge
                        variant="outline"
                        className="text-xs text-yellow-500 border-yellow-500"
                      >
                        Low stock
                      </Badge>
                    )}
                    {product.stock > 3 && (
                      <Badge
                        variant="outline"
                        className="text-xs text-green-500 border-green-500"
                      >
                        In stock
                      </Badge>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Weight className="h-4 w-4 mt-0.5 text-muted-foreground shrink-0" />
                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-wide mb-0.5">
                    Weight
                  </p>
                  <p className="font-medium">{weightKg} Kg</p>
                </div>
              </div>

              {product.specs && (
                <div className="flex items-start gap-3">
                  <Zap className="h-4 w-4 mt-0.5 text-muted-foreground shrink-0" />
                  <div>
                    <p className="text-xs text-muted-foreground uppercase tracking-wide mb-0.5">
                      Specs
                    </p>
                    <p className="font-medium leading-relaxed">
                      {product.specs}
                    </p>
                  </div>
                </div>
              )}

              {product.description && (
                <div className="flex items-start gap-3">
                  <FileText className="h-4 w-4 mt-0.5 text-muted-foreground shrink-0" />
                  <div>
                    <p className="text-xs text-muted-foreground uppercase tracking-wide mb-0.5">
                      Description
                    </p>
                    <p className="text-muted-foreground leading-relaxed">
                      {product.description}
                    </p>
                  </div>
                </div>
              )}
            </div>

            <Separator />

            <div className="pt-2">
              <AddToCartButton product={product} size="lg" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
