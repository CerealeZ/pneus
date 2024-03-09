import { useToast } from "@chakra-ui/react";
import { useCartStore } from "../zustand/store";
import { IProduct } from "../types/product";

export default function useWishlist() {
  const toast = useToast();

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

  const addItem = (item: IProduct) => {
    const isInWishList = wishedItemsIds.includes(item.id);

    if (isInWishList) {
      toast({
        title: ToastMessages.ALREADY_LIKED_TITLE,
        isClosable: true,
      });

      return;
    }

    addToWishlist(item.id);
    toast({
      title: ToastMessages.ADDED_TO_FAV_TITLE,
      isClosable: true,
      description: ToastMessages.ADDED_TO_FAV_DESC.replace(
        "{productName}",
        item.title
      ),
      status: "success",
    });
  };

  const checkIfInWishList = (item: IProduct) => {
    const isInWishList = wishedItemsIds.includes(item.id);
    return isInWishList;
  };

  return {
    wishedItems,
    removeFromWishlist,
    addToWishlist: addItem,
    clearWishlist,
    checkIfInWishList,
  };
}

enum ToastMessages {
  ADDED_TO_FAV_TITLE = "Curtiu mesmo!",
  ADDED_TO_FAV_DESC = "Seu item {productName} foi adicionado aos favoritos!",
  ADDED_TO_CART_TITLE = "Adicionado ao carrinho!",
  ADDED_TO_CART_DESC = "Seu item {productName} foi adicionado ao carrinho!",
  ALREADY_LIKED_TITLE = "Opa! Você já curtiu isso.",
}
