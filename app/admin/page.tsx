import { dbGetProducts, dbGetStoreConfig, dbGetQuotes } from "@/lib/actions";
import type { Quote, Product } from "@/lib/types";
import AdminPage from "./admin-page";

const Page = async () => {
  const [productsRaw, initialConfig, quotesRaw] = await Promise.all([
    dbGetProducts(),
    dbGetStoreConfig(),
    dbGetQuotes(),
  ]);

  // Prisma devuelve imageUrl: string | null; nuestro tipo usa string | undefined
  const initialProducts = productsRaw as unknown as Product[];
  // items es Prisma.JsonValue (campo JSON), lo casteamos a Quote[]
  const initialQuotes = quotesRaw as unknown as Quote[];

  return (
    <AdminPage
      products={initialProducts}
      initialConfig={initialConfig}
      initialQuotes={initialQuotes}
    />
  );
};

export default Page;
