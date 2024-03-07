import { useCartStore } from "../zustand/store";

export default function useWishlist() {
  const [
    wishedItemsIds,
    items,
    removeFromWishlist,
    addToWishlist,
    clearWishlist,
  ] = useCartStore((state) => [
    state.wishListIds,
    state.items,
    state.removeFromWishlist,
    state.addToWishlist,
    state.clearWishlist,
  ]);
  const wishedItems = items.filter((item) => wishedItemsIds.includes(item.id));
  return {
    wishedItems,
    removeFromWishlist,
    addToWishlist,
    clearWishlist,
  };
}
