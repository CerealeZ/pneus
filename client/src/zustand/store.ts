import { create } from "zustand";
import { IProduct } from "../types/product";
import { products } from "./products.json";

type State = {
  items: IProduct[];
  wishListIds: number[];
  cartItemsIds: number[];
};

export type Actions = {
  addItem: (item: IProduct) => void;
  removeItem: (id: number) => void;
  addItemToCart: (itemId: number) => void;
  removeItemFromCart: (itemId: number) => void;
  removeFromWishlist: (itemId: number) => void;
  addToWishlist: (itemId: number) => void;
};

export const useCartStore = create<State & Actions>()((set) => ({
  items: products,
  cartItemsIds: [],
  wishListIds: [],

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
}));
