"use server";
import { revalidatePath } from "next/cache";
import { db } from "./db";
import { type Status } from "@prisma/client";
import { Product, QuoteItem, StoreConfig } from "./types";

export const dbGetProducts = async () => {
  const products = await db.product.findMany();
  return products;
};

export const dbGetProductsByCategory = async (id: string) => {
  const products = await db.product.findMany({ where: { category: id } });
  return products;
};

export const dbNewProduct = async (data: Product) => {
  if (typeof data.price === "string") {
    data.price = parseFloat(data.price);
  }
  if (typeof data.weight === "string") {
    data.weight = parseFloat(data.weight);
  }
  if (typeof data.stock === "string") {
    data.stock = parseInt(data.stock, 10);
  }
  const product = await db.product.create({ data });
  return product;
};

export const dbUpdateProduct = async (data: Product) => {
  if (typeof data.price === "string") {
    data.price = parseFloat(data.price);
  }
  if (typeof data.weight === "string") {
    data.weight = parseFloat(data.weight);
  }
  if (typeof data.stock === "string") {
    data.stock = parseInt(data.stock, 10);
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

export const dbSearchProducts = async (query: string) => {
  const products = await db.product.findMany({
    where: {
      OR: [
        { name: { contains: query, mode: "insensitive" } },
        { brand: { contains: query, mode: "insensitive" } },
      ],
    },
  });
  return products;
};

export const dbGetProductById = async (id: string) => {
  const product = await db.product.findUnique({ where: { id } });
  return product;
};

export const dbGetStoreConfig = async (): Promise<StoreConfig> => {
  const config = await db.storeConfig.upsert({
    where: { id: "default" },
    update: {},
    create: { id: "default", exchangeRate: 1 },
  });
  return config;
};

export const dbUpdateStoreConfig = async (data: {
  exchangeRate: number;
}): Promise<StoreConfig> => {
  const config = await db.storeConfig.upsert({
    where: { id: "default" },
    update: data,
    create: { id: "default", ...data },
  });
  return config;
};

// ─── Quote actions ────────────────────────────────────────────────────────────

type CreateQuoteInput = {
  customer: {
    name: string;
    email: string;
    phone: string;
    company?: string;
    notes?: string;
  };
  items: QuoteItem[];
  startDate?: Date | null;
  endDate?: Date | null;
  totalDays: number;
};

export const dbGetQuotes = async () => {
  const quotes = await db.quote.findMany({
    include: { customer: true },
    orderBy: { createdAt: "desc" },
  });
  return quotes;
};

export const dbGetQuoteById = async (id: number) => {
  const quote = await db.quote.findUnique({
    where: { id },
    include: { customer: true },
  });
  return quote;
};

export const dbCreateQuote = async (data: CreateQuoteInput) => {
  const customer = await db.customer.create({
    data: {
      name: data.customer.name,
      email: data.customer.email,
      phone: data.customer.phone,
      company: data.customer.company ?? null,
      notes: data.customer.notes ?? null,
    },
  });

  const quote = await db.quote.create({
    data: {
      startDate: data.startDate ?? null,
      endDate: data.endDate ?? null,
      items: data.items,
      totalDays: data.totalDays,
      status: "PENDING",
      customerId: customer.id,
    },
    include: { customer: true },
  });

  return quote;
};

export const dbUpdateQuoteStatus = async (id: number, status: Status) => {
  const quote = await db.quote.update({
    where: { id },
    data: { status },
    include: { customer: true },
  });
  return quote;
};

export const dbUpdateQuote = async (
  id: number,
  data: {
    startDate?: Date | null;
    endDate?: Date | null;
    totalDays?: number;
    status?: Status;
    items?: QuoteItem[];
  },
) => {
  const quote = await db.quote.update({
    where: { id },
    data: {
      ...(data.startDate !== undefined && {
        startDate: data.startDate ?? undefined,
      }),
      ...(data.endDate !== undefined && { endDate: data.endDate ?? undefined }),
      ...(data.totalDays !== undefined && { totalDays: data.totalDays }),
      ...(data.status !== undefined && { status: data.status }),
      ...(data.items !== undefined && { items: data.items }),
    },
    include: { customer: true },
  });
  return quote;
};
