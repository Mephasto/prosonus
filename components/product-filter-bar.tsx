"use client";

import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const CATEGORIES = [
  { value: "MICROPHONES", label: "Micrófonos" },
  { value: "MIXERS", label: "Mezcladores" },
  { value: "PAS", label: "Sistemas PA" },
  { value: "DJ", label: "Equipos DJ" },
  { value: "HEADPHONES", label: "Audífonos" },
  { value: "CABLES", label: "Cables" },
  { value: "ACCESOSORIES", label: "Accesorios" },
];

interface ProductFilterBarProps {
  brands: string[];
  searchQuery: string;
  filterBrand: string;
  filterCategory: string;
  onSearchChange: (v: string) => void;
  onBrandChange: (v: string) => void;
  onCategoryChange: (v: string) => void;
  onClear: () => void;
  isFiltered: boolean;
  resultCount: number;
  totalCount: number;
  showCategoryFilter?: boolean;
  children?: React.ReactNode;
}

export default function ProductFilterBar({
  brands,
  searchQuery,
  filterBrand,
  filterCategory,
  onSearchChange,
  onBrandChange,
  onCategoryChange,
  onClear,
  isFiltered,
  resultCount,
  totalCount,
  showCategoryFilter = true,
  children,
}: ProductFilterBarProps) {
  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-wrap items-center gap-2">
        <div className="relative w-64">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Buscar productos..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </div>

        <Select value={filterBrand} onValueChange={onBrandChange}>
          <SelectTrigger className="w-44">
            <SelectValue placeholder="Todas las marcas" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todas las marcas</SelectItem>
            {brands.map((brand) => (
              <SelectItem key={brand} value={brand}>
                {brand}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {showCategoryFilter && (
          <Select value={filterCategory} onValueChange={onCategoryChange}>
            <SelectTrigger className="w-44">
              <SelectValue placeholder="Todas las categorías" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas las categorías</SelectItem>
              {CATEGORIES.map((cat) => (
                <SelectItem key={cat.value} value={cat.value}>
                  {cat.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}

        {isFiltered && (
          <Button variant="ghost" size="sm" onClick={onClear}>
            Limpiar filtros
          </Button>
        )}

        {children && <div className="ml-auto">{children}</div>}
      </div>

      {isFiltered && (
        <p className="text-sm text-muted-foreground">
          Mostrando {resultCount} de {totalCount} productos
        </p>
      )}
    </div>
  );
}
