export type Product = {
  id: string;
  name: string;
  brand: string;
  price: number;
  weight: number;
  stock: number;
  imageUrl?: string;
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

export type Categories = {
  name: string;
  enum: string;
  current?: boolean;
}[];

export type StoreConfig = {
  id: string;
  exchangeRate: number;
  updatedAt: Date;
};

export type QuoteStatus = "PENDING" | "APPROVED" | "CANCELED";

export type QuoteItem = {
  productId: string;
  quantity: number;
};

export type QuoteCustomer = {
  id: string;
  name: string;
  email: string;
  phone: string;
  company?: string | null;
  notes?: string | null;
};

export type Quote = {
  id: number;
  startDate: Date | null;
  endDate: Date | null;
  items: QuoteItem[];
  totalDays: number;
  status: QuoteStatus;
  customerId: string;
  customer: QuoteCustomer;
  createdAt: Date;
  updatedAt: Date;
};
