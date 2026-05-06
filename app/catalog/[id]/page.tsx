"use server";
import {
  dbGetCategories,
  dbGetProducts,
  dbGetProductsByCategory,
  dbGetStoreConfig,
} from "@/lib/actions";
import CatalogPage from "./catalog-page";
import { Product } from "@/lib/types";

const Home = async ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params;
  let products: Product[] = [];
  const [categories, config] = await Promise.all([
    dbGetCategories(),
    dbGetStoreConfig(),
  ]);
  if (id == "all") {
    products = await dbGetProducts();
  } else {
    products = await dbGetProductsByCategory(id);
  }
  return (
    <CatalogPage
      products={products}
      categories={categories}
      catselected={id}
      exchangeRate={config.exchangeRate}
    />
  );
};

export default Home;
