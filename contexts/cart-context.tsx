"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import { CartItem, readCartCookie, writeCartCookie } from "@/lib/cart";

type CartContextType = {
  items: CartItem[];
  hydrated: boolean;
  addItem: (productId: string, quantity: number, maxStock: number) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  itemCount: number;
  getItemQuantity: (productId: string) => number;
};

const CartContext = createContext<CartContextType | null>(null);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [hydrated, setHydrated] = useState(false);

  // Leer la cookie solo en el cliente (después de hidratación)
  useEffect(() => {
    setItems(readCartCookie());
    setHydrated(true);
  }, []);

  // Persistir cambios en cookie
  useEffect(() => {
    if (hydrated) {
      writeCartCookie(items);
    }
  }, [items, hydrated]);

  const addItem = useCallback(
    (productId: string, quantity: number, maxStock: number) => {
      setItems((prev) => {
        const existing = prev.find((i) => i.productId === productId);
        if (existing) {
          return prev.map((i) =>
            i.productId === productId
              ? { ...i, quantity: Math.min(maxStock, i.quantity + quantity) }
              : i,
          );
        }
        return [...prev, { productId, quantity: Math.min(maxStock, quantity) }];
      });
    },
    [],
  );

  const removeItem = useCallback((productId: string) => {
    setItems((prev) => prev.filter((i) => i.productId !== productId));
  }, []);

  const updateQuantity = useCallback(
    (productId: string, quantity: number) => {
      if (quantity <= 0) {
        removeItem(productId);
        return;
      }
      setItems((prev) =>
        prev.map((i) => (i.productId === productId ? { ...i, quantity } : i)),
      );
    },
    [removeItem],
  );

  const clearCart = useCallback(() => setItems([]), []);

  const getItemQuantity = useCallback(
    (productId: string) =>
      items.find((i) => i.productId === productId)?.quantity ?? 0,
    [items],
  );

  const itemCount = items.reduce((sum, i) => sum + i.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        items,
        hydrated,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        itemCount,
        getItemQuantity,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
