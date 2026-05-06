import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Headphones, ShieldCheck, Users } from "lucide-react";

export default function Home() {
  return (
    <div>
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32 bg-muted">
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 xl:grid-cols-2">
              <div className="flex flex-col justify-center space-y-4">
                <div className="space-y-2">
                  <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                    Alquiler de Equipos de Audio Profesional
                  </h1>
                  <p className="max-w-[600px] text-muted-foreground md:text-xl">
                    Alquilá equipos de audio de primer nivel para tus eventos,
                    estudios y producciones. Armá presupuestos personalizados y
                    gestioná tus alquileres fácilmente.
                  </p>
                </div>
                <div className="flex flex-col gap-2 min-[400px]:flex-row">
                  <Link href="/catalog/all">
                    <Button size="lg">Ver catálogo</Button>
                  </Link>
                  <Link href="/quote">
                    <Button size="lg" variant="outline">
                      Pedir presupuesto
                    </Button>
                  </Link>
                </div>
              </div>
              <div className="flex items-center justify-center">
                <img
                  src="/placeholder.svg?height=400&width=400"
                  alt="Audio Equipment"
                  className="rounded-lg object-cover invert"
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
                  ¿Cómo funciona?
                </h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Alquilar equipos de audio nunca fue tan fácil. Explorá el
                  catálogo, armá tu presupuesto y conseguí lo que necesitás.
                </p>
              </div>
            </div>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-3 md:gap-8 mt-8">
              <div className="flex flex-col items-center space-y-2 border rounded-lg p-6">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted">
                  <Headphones className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-bold">Explorá el catálogo</h3>
                <p className="text-center text-muted-foreground">
                  Navegá nuestro extenso catálogo de equipos de audio
                  profesional con especificaciones detalladas y disponibilidad
                  en tiempo real.
                </p>
              </div>
              <div className="flex flex-col items-center space-y-2 border rounded-lg p-6">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted">
                  <ShieldCheck className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-bold">Pedí tu presupuesto</h3>
                <p className="text-center text-muted-foreground">
                  Seleccioná los equipos que necesitás y generá un presupuesto a
                  medida para tu período de alquiler.
                </p>
              </div>
              <div className="flex flex-col items-center space-y-2 border rounded-lg p-6">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted">
                  <Users className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-bold">Gestión de inventario</h3>
                <p className="text-center text-muted-foreground">
                  El equipo de administración gestiona el catálogo, actualiza la
                  información de los productos y hace seguimiento de los
                  alquileres.
                </p>
              </div>
            </div>
          </div>
        </section>
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
