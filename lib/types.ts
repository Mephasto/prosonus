export type Product = {
  id: string;
  name: string;
  brand: string;
  price: number;
  weight: number;
  specs?: string;
  description?: string;
  category: Category;
  createdAt: Date;
  updatedAt: Date;
};

export type Category =
  | "MICROPHONES"
  | "MIXERS"
  | "PAS"
  | "DJ"
  | "HEADPHONES"
  | "CABLES"
  | "ACCESOSORIES";
