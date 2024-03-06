import { useCartStore } from "../zustand/store";

export default function useCart() {
  const [items, cartItemsIds, removeItemFromCart, addItemToCart] = useCartStore(
    (state) => [
      state.items,
      state.cartItemsIds,
      state.removeItemFromCart,
      state.addItemToCart,
    ]
  );
  const cartItems = items.filter((item) => cartItemsIds.includes(item.id));
  return {
    cartItems,
    removeItemFromCart,
    addItemToCart,
  };
}
