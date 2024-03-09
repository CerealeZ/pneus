import { create } from "zustand";
import { IProduct } from "../types/product";
import { products } from "./products.json";
import { data as categories } from "./categories.json";
import { pick } from "underscore";
import { ProductQuery } from "../pages/home/components/search/search";

type State = {
  items: IProduct[];
  filteredItems: IProduct[];
  categories: {
    title: string;
    value: string;
    brands: { title: string; value: string }[];
  }[];
  wishListIds: number[];
  cartItemsIds: number[];
  filter: ProductQuery;
};

export type Actions = {
  addItem: (item: IProduct) => void;
  removeItem: (id: number) => void;
  addItemToCart: (itemId: number) => void;
  removeItemFromCart: (itemId: number) => void;
  removeFromWishlist: (itemId: number) => void;
  addToWishlist: (itemId: number) => void;
  clearCart: () => void;
  clearWishlist: () => void;
  setFilter: (filter: ProductQuery) => void;
  clearFilters: () => void;
};

export const useCartStore = create<State & Actions>()((set) => ({
  items: products,
  filteredItems: products,
  categories,
  cartItemsIds: [],
  wishListIds: [],
  filter: {},

  addItem: (newItem) =>
    set((state) => {
      return {
        items: [...state.items, newItem],
      };
    }),
  removeItem: (itemId) => {
    set((state) => {
      return {
        items: state.items.filter((item) => item.id !== itemId),
      };
    });
  },
  addToWishlist: (itemId) => {
    set((state) => {
      const wishList = new Set(state.wishListIds);
      wishList.add(itemId);
      return {
        wishListIds: Array.from(wishList),
      };
    });
  },
  removeFromWishlist: (itemId) => {
    set((state) => {
      return {
        wishListIds: state.wishListIds.filter((id) => id !== itemId),
      };
    });
  },

  addItemToCart: (itemId) => {
    set((state) => {
      const cartIds = new Set(state.cartItemsIds);
      cartIds.add(itemId);
      return {
        cartItemsIds: Array.from(cartIds),
      };
    });
  },

  removeItemFromCart: (itemId) => {
    set((state) => {
      return {
        cartItemsIds: state.cartItemsIds.filter((id) => id !== itemId),
      };
    });
  },

  clearCart: () => {
    set({ cartItemsIds: [] });
  },

  clearWishlist: () => {
    set({ wishListIds: [] });
  },

  setFilter: (filter) => {
    const filteredFilter = pick(filter, (value) => value);
    set({ filter: filteredFilter });
  },

  clearFilters() {
    set({ filter: {} });
  },
}));
