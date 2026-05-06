"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ShoppingCart, Plus, Minus, Check } from "lucide-react";
import { useCart } from "@/contexts/cart-context";
import { Product } from "@/lib/types";

export function AddToCartButton({
  product,
  size = "default",
}: {
  product: Product;
  size?: "default" | "lg";
}) {
  const { addItem, getItemQuantity } = useCart();
  const [qty, setQty] = useState(1);
  const [justAdded, setJustAdded] = useState(false);

  const inCartQty = getItemQuantity(product.id);
  const maxAdditional = product.stock - inCartQty;
  const canAdd = maxAdditional > 0;

  const handleAdd = () => {
    if (!canAdd) return;
    addItem(product.id, qty, product.stock);
    setJustAdded(true);
    setQty(1);
    setTimeout(() => setJustAdded(false), 1500);
  };

  if (product.stock === 0) {
    return (
      <Button disabled size={size} className="flex-1">
        Sin stock
      </Button>
    );
  }

  return (
    <div className="flex items-center gap-2 w-full">
      {/* Selector de cantidad */}
      <div className="flex items-center border rounded-md shrink-0">
        <Button
          variant="ghost"
          size="icon"
          className="h-9 w-9"
          onClick={() => setQty((q) => Math.max(1, q - 1))}
          disabled={qty <= 1}
          aria-label="Reducir cantidad"
        >
          <Minus className="h-3 w-3" />
        </Button>
        <span className="w-7 text-center text-sm font-medium">{qty}</span>
        <Button
          variant="ghost"
          size="icon"
          className="h-9 w-9"
          onClick={() => setQty((q) => Math.min(maxAdditional, q + 1))}
          disabled={qty >= maxAdditional}
          aria-label="Aumentar cantidad"
        >
          <Plus className="h-3 w-3" />
        </Button>
      </div>

      {/* Botón agregar */}
      <Button
        size={size}
        className="flex-1"
        onClick={handleAdd}
        disabled={!canAdd || justAdded}
      >
        {justAdded ? (
          <>
            <Check className="mr-2 h-4 w-4" />
            Agregado
          </>
        ) : !canAdd ? (
          <>
            <ShoppingCart className="mr-2 h-4 w-4" />
            Máx. en cotización
          </>
        ) : (
          <>
            <ShoppingCart className="mr-2 h-4 w-4" />
            {inCartQty > 0 ? "Agregar más" : "Agregar al presupuesto"}
          </>
        )}
      </Button>
    </div>
  );
}
