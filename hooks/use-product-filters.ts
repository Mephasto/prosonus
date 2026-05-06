"use client";

import { useState, useMemo } from "react";
import { Product } from "@/lib/types";

export function useProductFilters(products: Product[]) {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterBrand, setFilterBrand] = useState("all");
  const [filterCategory, setFilterCategory] = useState("all");

  const brands = useMemo(
    () => Array.from(new Set(products.map((p) => p.brand))).sort(),
    [products]
  );

  const filteredProducts = useMemo(
    () =>
      products.filter((p) => {
        const matchesSearch =
          searchQuery === "" ||
          p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.brand.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesBrand = filterBrand === "all" || p.brand === filterBrand;
        const matchesCategory =
          filterCategory === "all" || p.category === filterCategory;
        return matchesSearch && matchesBrand && matchesCategory;
      }),
    [products, searchQuery, filterBrand, filterCategory]
  );

  const isFiltered =
    searchQuery !== "" || filterBrand !== "all" || filterCategory !== "all";

  const clearFilters = () => {
    setSearchQuery("");
    setFilterBrand("all");
    setFilterCategory("all");
  };

  return {
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
  };
}
