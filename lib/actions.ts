"use server";
import { revalidatePath } from "next/cache";
import { db } from "./db";
import { Product } from "./types";

export const dbGetProducts = async () => {
  const products = await db.product.findMany();
  return products;
};

export const dbGetProductsByCategory = async (id: string) => {
  const products = await db.product.findMany({ where: { category: id } });
  return products;
};

export const dbNewProduct = async (data: Product) => {
  // console.log(data);
  if (typeof data.price === "string") {
    data.price = parseFloat(data.price);
  }
  if (typeof data.weight === "string") {
    data.weight = parseFloat(data.weight);
  }
  const product = await db.product.create({ data });
  return product;
};

export const dbUpdateProduct = async (data: Product) => {
  console.log(data);
  if (typeof data.price === "string") {
    data.price = parseFloat(data.price);
  }
  if (typeof data.weight === "string") {
    data.weight = parseFloat(data.weight);
  }
  const product = await db.product.update({
    where: { id: data.id },
    data,
  });
  return product;
};

export const dbDeleteProduct = async (id: string) => {
  const product = await db.product.delete({
    where: { id },
  });
  return product;
};

export const dbGetCategories = async () => {
  const categories = await db.categories.findMany();
  return categories;
};
