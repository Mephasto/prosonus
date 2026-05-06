import type { Metadata } from "next";
import Header from "@/components/header";
import { CartProvider } from "@/contexts/cart-context";
import "./globals.css";

export const metadata: Metadata = {
  title: "ProSonus",
  description: "Created with v0",
  generator: "v0.dev",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
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
