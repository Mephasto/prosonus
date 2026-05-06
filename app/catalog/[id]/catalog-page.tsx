"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { AddToCartButton } from "@/components/add-to-cart-button";
import { Badge } from "@/components/ui/badge";
import { Product, Categories } from "@/lib/types";
import { ChevronDownIcon } from "@heroicons/react/16/solid";
import { useProductFilters } from "@/hooks/use-product-filters";
import ProductFilterBar from "@/components/product-filter-bar";
import { formatARS, formatUSD } from "@/lib/prices";

export default function CatalogPage({
  products,
  categories,
  catselected,
  exchangeRate = 1,
}: {
  products: Product[];
  categories: Categories;
  catselected: string;
  exchangeRate?: number;
}) {
  const {
    searchQuery,
    setSearchQuery,
    filterBrand,
    setFilterBrand,
    filterCategory,
    setFilterCategory,
    filteredProducts,
    brands,
    isFiltered,
    clearFilters,
  } = useProductFilters(products);

  return (
    <div>
      <main className="flex-1">
        <div className="container px-4 py-6 md:px-6 md:py-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">
                Catálogo de Equipos
              </h1>
              <p className="text-muted-foreground">
                Explorá nuestra selección de equipos de audio profesional para
                alquilar
              </p>
            </div>
            <div className="w-full md:w-auto">
              <ProductFilterBar
                brands={brands}
                searchQuery={searchQuery}
                filterBrand={filterBrand}
                filterCategory={filterCategory}
                onSearchChange={setSearchQuery}
                onBrandChange={setFilterBrand}
                onCategoryChange={setFilterCategory}
                onClear={clearFilters}
                isFiltered={isFiltered}
                resultCount={filteredProducts.length}
                totalCount={products.length}
                showCategoryFilter={catselected === "all"}
              />
            </div>
          </div>
          <Nav categories={categories} catselected={catselected} />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProducts.map((product) => (
              <Card key={product.id} className="flex flex-col">
                <Link href={`/catalog/product/${product.id}`}>
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle>{product.name}</CardTitle>
                        <CardDescription>{product.brand}</CardDescription>
                      </div>
                      <Badge>{product.category}</Badge>
                    </div>
                  </CardHeader>
                </Link>
                <CardContent className="flex-1">
                  <div className="aspect-square relative mb-4">
                    <img
                      src={
                        product.imageUrl
                          ? `/api/images/${product.imageUrl}`
                          : `/placeholder.svg?height=300&width=300&text=${encodeURIComponent(product.name)}`
                      }
                      alt={product.name}
                      className={`rounded-md object-cover w-full h-full ${!product.imageUrl ? "invert" : ""}`}
                    />
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="font-medium">Precio:</span>
                      <div className="text-right">
                        {exchangeRate > 1 ? (
                          <>
                            <div className="font-medium">
                              {formatARS(product.price, exchangeRate)}/día
                            </div>
                            <div className="text-xs text-muted-foreground">
                              {formatUSD(product.price)} USD
                            </div>
                          </>
                        ) : (
                          <span>{formatUSD(product.price)}/día</span>
                        )}
                      </div>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium">Peso:</span>
                      <span>{(product.weight / 1000).toFixed(2)} Kg</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium">Especificaciones:</span>
                      <span className="text-right">{product.specs}</span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {product.description}
                    </p>
                  </div>
                </CardContent>
                <CardFooter className="flex flex-col gap-2">
                  <Button variant="outline" className="w-full" asChild>
                    <Link href={`/catalog/product/${product.id}`}>
                      Ver detalles
                    </Link>
                  </Button>
                  <AddToCartButton product={product} />
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
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
