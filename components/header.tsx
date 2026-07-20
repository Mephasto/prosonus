"use client";

import Image from "next/image";
import Link from "next/link";
import { ShoppingCart } from "lucide-react";
import { useCart } from "@/contexts/cart-context";
import { useAccent, ACCENT_META, ACCENTS } from "@/contexts/accent-context";

const Header = () => {
  const { itemCount } = useCart();
  const { accent, rotate } = useAccent();

  const current = ACCENT_META[accent];
  const next =
    ACCENT_META[ACCENTS[(ACCENTS.indexOf(accent) + 1) % ACCENTS.length]];

  return (
    <header className="border-b">
      <div className="container flex h-16 items-center px-4 md:px-6">
        <Link href="/" className="flex items-center gap-2 font-semibold">
          <Image
            src="/logo_white.png"
            alt={"ProSonus"}
            height={40}
            width={150}
            className=""
          />
        </Link>
        <nav className="ml-auto flex gap-4 sm:gap-6 items-center">
          <Link
            href="/catalog/all"
            className="text-sm font-medium hover:underline underline-offset-4"
          >
            Catálogo
          </Link>
          <Link
            href="/quote"
            className="text-sm font-medium hover:underline underline-offset-4 flex items-center gap-1.5"
          >
            <span className="relative">
              <ShoppingCart className="h-5 w-5" />
              {itemCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-primary text-primary-foreground text-xs font-bold rounded-full h-4 w-4 flex items-center justify-center leading-none">
                  {itemCount > 99 ? "99+" : itemCount}
                </span>
              )}
            </span>
            <span>Presupuesto</span>
          </Link>

          {/* Accent colour rotator */}
          <button
            onClick={rotate}
            title={`Color actual: ${current.label} — siguiente: ${next.label}`}
            className="flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium border border-border hover:border-primary transition-colors"
          >
            <span
              className="inline-block h-3 w-3 rounded-full ring-1 ring-white/20 transition-colors duration-300"
              style={{ background: current.color }}
            />
            <span className="text-muted-foreground">Any color you like</span>
          </button>
        </nav>
      </div>
    </header>
  );
};

export default Header;
