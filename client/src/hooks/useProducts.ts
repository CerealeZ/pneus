import { useCartStore } from "../zustand/store";

export default function useProducts() {
  const [products] = useCartStore((state) => [state.items]);

  return { products };
}
