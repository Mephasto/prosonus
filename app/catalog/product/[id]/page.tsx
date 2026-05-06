import { notFound } from "next/navigation";
import { dbGetProductById, dbGetStoreConfig } from "@/lib/actions";
import ProductDetail from "./product-detail";

const ProductPage = async ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params;
  const [product, config] = await Promise.all([
    dbGetProductById(id),
    dbGetStoreConfig(),
  ]);
  if (!product) notFound();
  return <ProductDetail product={product} exchangeRate={config.exchangeRate} />;
};

export default ProductPage;
