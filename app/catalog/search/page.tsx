import {
  dbGetCategories,
  dbSearchProducts,
  dbGetStoreConfig,
} from "@/lib/actions";
import CatalogPage from "../[id]/catalog-page";

const SearchPage = async ({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) => {
  const { q = "" } = await searchParams;
  const [products, categories, config] = await Promise.all([
    dbSearchProducts(q),
    dbGetCategories(),
    dbGetStoreConfig(),
  ]);
  return (
    <CatalogPage
      products={products}
      categories={categories}
      catselected="search"
      exchangeRate={config.exchangeRate}
    />
  );
};

export default SearchPage;
