import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Headphones, Filter, ShoppingCart } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"

// Mock data for the catalog
const products = [
  {
    id: 1,
    name: "Professional Studio Headphones",
    brand: "AudioTech",
    price: 25,
    weight: "250g",
    specs: "20Hz-20kHz, 32 Ohm",
    description: "High-quality studio headphones with excellent sound isolation.",
    category: "Headphones",
  },
  {
    id: 2,
    name: "Wireless Microphone System",
    brand: "SoundPro",
    price: 75,
    weight: "450g",
    specs: "UHF 500-900MHz, 100m range",
    description: "Professional wireless microphone system with dual receivers.",
    category: "Microphones",
  },
  {
    id: 3,
    name: "Powered PA Speaker",
    brand: "StageMaster",
    price: 120,
    weight: "15kg",
    specs: "1000W, 15-inch woofer, 133dB max SPL",
    description: "Powerful PA speaker with built-in mixer and Bluetooth connectivity.",
    category: "Speakers",
  },
  {
    id: 4,
    name: "Digital Mixing Console",
    brand: "MixPro",
    price: 200,
    weight: "8kg",
    specs: "32 channels, 16 aux sends, 8 DCA groups",
    description: "Professional digital mixer with motorized faders and touchscreen interface.",
    category: "Mixers",
  },
  {
    id: 5,
    name: "Condenser Microphone",
    brand: "VocalMaster",
    price: 45,
    weight: "380g",
    specs: "20Hz-20kHz, Cardioid pattern",
    description: "Studio-grade condenser microphone for vocal and instrument recording.",
    category: "Microphones",
  },
  {
    id: 6,
    name: "DJ Controller",
    brand: "BeatMix",
    price: 150,
    weight: "5kg",
    specs: "4-channel, built-in audio interface",
    description: "Professional DJ controller with jog wheels and performance pads.",
    category: "DJ Equipment",
  },
]

export default function CatalogPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="border-b">
        <div className="container flex h-16 items-center px-4 md:px-6">
          <Link href="/" className="flex items-center gap-2 font-semibold">
            <Headphones className="h-6 w-6" />
            <span>AudioRent Pro</span>
          </Link>
          <nav className="ml-auto flex gap-4 sm:gap-6">
            <Link href="/catalog" className="text-sm font-medium hover:underline underline-offset-4">
              Catalog
            </Link>
            <Link href="/quote" className="text-sm font-medium hover:underline underline-offset-4">
              Create Quote
            </Link>
            <Link href="/admin" className="text-sm font-medium hover:underline underline-offset-4">
              Admin
            </Link>
          </nav>
        </div>
      </header>
      <main className="flex-1">
        <div className="container px-4 py-6 md:px-6 md:py-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Audio Equipment Catalog</h1>
              <p className="text-muted-foreground">Browse our selection of professional audio equipment for rent</p>
            </div>
            <div className="flex flex-col sm:flex-row gap-2 w-full md:w-auto">
              <div className="relative w-full md:w-64">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input type="search" placeholder="Search products..." className="pl-8 w-full" />
              </div>
              <Button variant="outline" size="icon">
                <Filter className="h-4 w-4" />
                <span className="sr-only">Filter</span>
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((product) => (
              <Card key={product.id} className="flex flex-col">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle>{product.name}</CardTitle>
                      <CardDescription>{product.brand}</CardDescription>
                    </div>
                    <Badge>{product.category}</Badge>
                  </div>
                </CardHeader>
                <CardContent className="flex-1">
                  <div className="aspect-square relative mb-4">
                    <img
                      src={`/placeholder.svg?height=300&width=300&text=${encodeURIComponent(product.name)}`}
                      alt={product.name}
                      className="rounded-md object-cover w-full h-full"
                    />
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="font-medium">Daily Rate:</span>
                      <span>${product.price}/day</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium">Weight:</span>
                      <span>{product.weight}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium">Specs:</span>
                      <span className="text-right">{product.specs}</span>
                    </div>
                    <p className="text-sm text-muted-foreground">{product.description}</p>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button className="w-full">
                    <ShoppingCart className="mr-2 h-4 w-4" />
                    Add to Quote
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      </main>
      <footer className="border-t">
        <div className="container flex flex-col gap-2 py-4 md:h-16 md:flex-row md:items-center md:py-0 px-4 md:px-6">
          <div className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} AudioRent Pro. All rights reserved.
          </div>
          <nav className="md:ml-auto flex gap-4 sm:gap-6">
            <Link href="#" className="text-xs hover:underline underline-offset-4">
              Terms of Service
            </Link>
            <Link href="#" className="text-xs hover:underline underline-offset-4">
              Privacy
            </Link>
          </nav>
        </div>
      </footer>
    </div>
  )
}

function Search(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="11" cy="11" r="8" />
      <path d="m21 21-4.3-4.3" />
    </svg>
  )
}
