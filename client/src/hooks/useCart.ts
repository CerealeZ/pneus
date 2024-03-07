import { useCartStore } from "../zustand/store";

export default function useCart() {
  const [items, cartItemsIds, removeItemFromCart, addItemToCart, clearCart] =
    useCartStore((state) => [
      state.items,
      state.cartItemsIds,
      state.removeItemFromCart,
      state.addItemToCart,
      state.clearCart,
    ]);
  const cartItems = items.filter((item) => cartItemsIds.includes(item.id));
  return {
    cartItems,
    removeItemFromCart,
    addItemToCart,
    clearCart,
  };
}
