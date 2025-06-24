import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Filter, ShoppingCart } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Product, Categories } from "@/lib/types";

export default function CatalogPage({
  products,
  categories,
  catselected,
}: {
  products: Product[];
  categories: Categories;
  catselected: string;
}) {
  return (
    <div>
      <main className="flex-1">
        <div className="container px-4 py-6 md:px-6 md:py-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">
                Audio Equipment Catalog
              </h1>
              <p className="text-muted-foreground">
                Browse our selection of professional audio equipment for rent
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-2 w-full md:w-auto">
              <div className="relative w-full md:w-64">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search products..."
                  className="pl-8 w-full"
                />
              </div>
              <Button variant="outline" size="icon">
                <Filter className="h-4 w-4" />
                <span className="sr-only">Filter</span>
              </Button>
            </div>
          </div>
          <Nav categories={categories} catselected={catselected} />

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
                      className="rounded-md object-cover w-full h-full invert"
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
                    <p className="text-sm text-muted-foreground">
                      {product.description}
                    </p>
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
  );
}

import { ChevronDownIcon } from "@heroicons/react/16/solid";

const Nav = ({
  categories,
  catselected,
}: {
  categories: any;
  catselected: string;
}) => {
  let cats: Categories = Object.values(categories);
  return (
    <div className="px-4 py-6 sm:px-0 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="grid grid-cols-1 sm:hidden">
          {/* Use an "onChange" listener to redirect the user to the selected tab URL. */}
          <select
            defaultValue={catselected}
            aria-label="Select a tab"
            className="col-start-1 row-start-1 w-full appearance-none rounded-md bg-white/5 py-2 pr-8 pl-3 text-base text-white outline-1 -outline-offset-1 outline-white/10 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-500"
          >
            {cats.map((cat) =>
              cat.enum === catselected ? (
                <option
                  key={cat.enum}
                  value={cat.enum}
                  className="bg-indigo-500 text-white"
                >
                  {cat.name}
                </option>
              ) : (
                <option key={cat.enum} value={cat.enum}>
                  {cat.name}
                </option>
              ),
            )}
          </select>
          <ChevronDownIcon
            aria-hidden="true"
            className="pointer-events-none col-start-1 row-start-1 mr-2 size-5 self-center justify-self-end"
          />
        </div>
        <div className="hidden sm:block">
          <nav className="flex border-b border-white/10 py-4">
            <ul
              role="list"
              className="flex min-w-full flex-none lg:gap-x-6 px-2 md:gap-x-0 sm:gap-x-0 sm:px-0 text-sm/6 uppercase text-gray-400 "
            >
              {cats.map((cat) => (
                <li key={cat.enum}>
                  <a
                    href={"" + cat.enum}
                    className={
                      cat.enum == catselected
                        ? "text-indigo-400 lg:p-6 md:p-4 sm:p-4"
                        : "hover:text-white lg:p-6 md:p-4 sm:p-4"
                    }
                  >
                    {cat.name}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </div>
    </div>
  );
};
