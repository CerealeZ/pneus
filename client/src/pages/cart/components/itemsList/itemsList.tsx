import * as ItemsListStyles from "./styles";
import useCart from "../../../../hooks/useCart";

export const ItemsList = () => {
  const { cartItems } = useCart();
  return (
    <ItemsListStyles.Container>
      {cartItems.map((item) => (
        <li key={item.id}>
          {item.title} - R$ {item.price}
        </li>
      ))}
    </ItemsListStyles.Container>
  );
};
