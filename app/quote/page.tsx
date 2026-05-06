"use server";
import {
  dbGetCategories,
  dbGetProducts,
  dbGetStoreConfig,
} from "@/lib/actions";
import QuotePage from "./quote-page";
import { Product } from "@/lib/types";

const Quote = async () => {
  const [categories, products, storeConfig] = await Promise.all([
    dbGetCategories(),
    dbGetProducts(),
    dbGetStoreConfig(),
  ]);

  return (
    <QuotePage
      products={products as Product[]}
      categories={categories}
      exchangeRate={storeConfig?.exchangeRate ?? 1}
    />
  );
};

export default Quote;
