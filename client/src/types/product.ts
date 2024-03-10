export interface IProduct {
  id: number;
  title: string;
  description: string;
  price: number;
  discountPercentage: number;
  rating: number;
  stock: number;
  brand: string;
  category: string;
  thumbnail: string;
  images: string[];
}

export interface ProductQuery {
  q?: string;
  sorting?: {
    by: SortableValue;
    order: Orders;
  }[];
  order?: Orders;
  page?: number;
  size?: number | string;
  brand?: string;
  category?: string;
  discountPercentage?: number | string;
  price?: number | string;
  rating?: number | string;
  stock?: number | string;
  ["max-rating"]?: string | number;
  ["min-rating"]?: string | number;
  ["max-price"]?: string | number;
  ["min-price"]?: string | number;
  ["max-discount"]?: string | number;
  ["min-discount"]?: string | number;
  ["max-stock"]?: string | number;
  ["min-stock"]?: string | number;
}

export type Orders = "asc" | "desc";

export type SortableValue = keyof Omit<
  IProduct & { discountedTotal: number },
  "images" | "title"
>;
