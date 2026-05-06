import type { Metadata } from "next";
import Header from "@/components/header";
import { CartProvider } from "@/contexts/cart-context";
import "./globals.css";

export const metadata: Metadata = {
  title: "ProSonus",
  description:
    "Alquiler de equipos de audio profesional para eventos, estudios y producciones.",
  generator: "v0.dev",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className="dark">
      <body>
        <CartProvider>
          <div className="flex flex-col min-h-screen">
            <Header />
            {children}
          </div>
        </CartProvider>
      </body>
    </html>
  );
}
