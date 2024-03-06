import { ProductList } from "./components/productList/productList";

import useCart from "../../hooks/useCart";
import useWishlist from "../../hooks/useWishlist";
import useProducts from "../../hooks/useProducts";

export const Home = () => {
  const { products } = useProducts();
  const { addItemToCart } = useCart();
  const { addToWishlist } = useWishlist();

  return (
    <>
      <h1>Sejam bem-vindos!</h1>
      <ProductList
        products={products}
        onAddToCart={({ id }) => addItemToCart(id)}
        onLike={({ id }) => addToWishlist(id)}
      />
    </>
  );
};
