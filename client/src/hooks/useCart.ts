import { useToast } from "@chakra-ui/react";
import { useCartStore } from "../zustand/store";
import { IProduct } from "../types/product";

export default function useCart() {
  const toast = useToast();

  const [items, cartItemsIds, removeItemFromCart, addItemToCart, clearCart] =
    useCartStore((state) => [
      state.items,
      state.cartItemsIds,
      state.removeItemFromCart,
      state.addItemToCart,
      state.clearCart,
    ]);
  const cartItems = items.filter((item) => cartItemsIds.includes(item.id));

  const addItem = (product: IProduct) => {
    const isAlreadyInCart = cartItemsIds.includes(product.id);
    if (isAlreadyInCart) {
      toast({
        title: ToastMessages.ALREADY_IN_CART_TITLE,
        isClosable: true,
      });

      return;
    }

    addItemToCart(product.id);
    toast({
      title: ToastMessages.ADDED_TO_CART_TITLE,
      isClosable: true,
      description: ToastMessages.ADDED_TO_FAV_DESC.replace(
        "{productName}",
        product.title
      ),
      status: "success",
    });
  };

  const checkIfCart = (product: IProduct) => {
    return cartItemsIds.includes(product.id);
  };

  return {
    cartItems,
    removeItemFromCart,
    addItemToCart: addItem,
    clearCart,
    checkIfCart,
  };
}

enum ToastMessages {
  ADDED_TO_CART_TITLE = "Adicionado ao carrinho!",
  ADDED_TO_CART_DESC = "Seu item {productName} foi adicionado ao carrinho!",
  ALREADY_IN_CART_TITLE = "Opa! você já adicionou este item ao carrinho.",
}
