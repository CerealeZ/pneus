import { ProductList } from "./components/productList/productList";
import { Search } from "./components/search/search";

export const Home = () => {
  return (
    <>
      <Search />
      <ProductList />
    </>
  );
};
