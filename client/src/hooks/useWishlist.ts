import { useCartStore } from "../zustand/store";

export default function useWishlist() {
  const [wishedItemsIds, items, removeFromWishlist, addToWishlist] =
    useCartStore((state) => [
      state.wishListIds,
      state.items,
      state.removeFromWishlist,
      state.addToWishlist,
    ]);
  const wishedItems = items.filter((item) => wishedItemsIds.includes(item.id));
  return {
    wishedItems,
    removeFromWishlist,
    addToWishlist,
  };
}
