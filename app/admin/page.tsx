import { dbGetProducts } from "@/lib/actions";
import AdminPage from "./admin-page";

const Page = async () => {
  // Mock data for the catalog
  const initialProducts = await dbGetProducts();

  return <AdminPage data={initialProducts} />;
};

export default Page;
