import { notFound } from "next/navigation";
import { dbGetQuoteById, dbGetProducts, dbGetStoreConfig } from "@/lib/actions";
import type { Quote, Product } from "@/lib/types";
import QuoteDetailPage from "./quote-detail";

const Page = async ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params;

  const [quoteRaw, products, config] = await Promise.all([
    dbGetQuoteById(Number(id)),
    dbGetProducts(),
    dbGetStoreConfig(),
  ]);

  if (!quoteRaw) {
    notFound();
  }

  // items es Prisma.JsonValue (campo JSON), lo casteamos a Quote
  const quote = quoteRaw as unknown as Quote;

  return (
    <QuoteDetailPage
      quote={quote}
      products={products as Product[]}
      exchangeRate={config.exchangeRate}
    />
  );
};

export default Page;
