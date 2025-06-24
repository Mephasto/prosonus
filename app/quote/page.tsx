"use server";
import { dbGetCategories, dbGetProducts } from "@/lib/actions";
import QuotePage from "./quote-page";
import { Product } from "@/lib/types";

const Quote = async () => {
  const categories = await dbGetCategories();
  const products: Product[] = await dbGetProducts();

  return <QuotePage products={products} categories={categories} />;
};

export default Quote;
