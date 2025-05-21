import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Headphones, ShieldCheck, Users } from "lucide-react";
import Image from "next/image";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
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
          <nav className="ml-auto flex gap-4 sm:gap-6">
            <Link
              href="/catalog"
              className="text-sm font-medium hover:underline underline-offset-4"
            >
              Catalog
            </Link>
            <Link
              href="/quote"
              className="text-sm font-medium hover:underline underline-offset-4"
            >
              Create Quote
            </Link>
            <Link
              href="/admin"
              className="text-sm font-medium hover:underline underline-offset-4"
            >
              Admin
            </Link>
          </nav>
        </div>
      </header>
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32 bg-muted">
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 xl:grid-cols-2">
              <div className="flex flex-col justify-center space-y-4">
                <div className="space-y-2">
                  <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                    Professional Audio Equipment Rental
                  </h1>
                  <p className="max-w-[600px] text-muted-foreground md:text-xl">
                    Rent top-quality audio equipment for your events, studios,
                    and productions. Create custom quotes and manage your
                    rentals with ease.
                  </p>
                </div>
                <div className="flex flex-col gap-2 min-[400px]:flex-row">
                  <Link href="/catalog">
                    <Button size="lg">Browse Catalog</Button>
                  </Link>
                  <Link href="/quote">
                    <Button size="lg" variant="outline">
                      Create Quote
                    </Button>
                  </Link>
                </div>
              </div>
              <div className="flex items-center justify-center">
                <img
                  src="/placeholder.svg?height=400&width=400"
                  alt="Audio Equipment"
                  className="rounded-lg object-cover"
                  width={400}
                  height={400}
                />
              </div>
            </div>
          </div>
        </section>
        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                  How It Works
                </h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Renting audio equipment has never been easier. Browse our
                  catalog, create a quote, and get the gear you need.
                </p>
              </div>
            </div>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-3 md:gap-8 mt-8">
              <div className="flex flex-col items-center space-y-2 border rounded-lg p-6">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted">
                  <Headphones className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-bold">Browse Catalog</h3>
                <p className="text-center text-muted-foreground">
                  Explore our extensive catalog of professional audio equipment,
                  with detailed specifications and availability.
                </p>
              </div>
              <div className="flex flex-col items-center space-y-2 border rounded-lg p-6">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted">
                  <ShieldCheck className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-bold">Create Quote</h3>
                <p className="text-center text-muted-foreground">
                  Select the equipment you need and generate a custom quote for
                  your rental period.
                </p>
              </div>
              <div className="flex flex-col items-center space-y-2 border rounded-lg p-6">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted">
                  <Users className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-bold">Admin Management</h3>
                <p className="text-center text-muted-foreground">
                  Administrators can manage the catalog, update product
                  information, and track rentals.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
      <footer className="border-t">
        <div className="container flex flex-col gap-2 py-4 md:h-16 md:flex-row md:items-center md:py-0 px-4 md:px-6">
          <div className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} AudioRent Pro. All rights reserved.
          </div>
          <nav className="md:ml-auto flex gap-4 sm:gap-6">
            <Link
              href="#"
              className="text-xs hover:underline underline-offset-4"
            >
              Terms of Service
            </Link>
            <Link
              href="#"
              className="text-xs hover:underline underline-offset-4"
            >
              Privacy
            </Link>
          </nav>
        </div>
      </footer>
    </div>
  );
}
