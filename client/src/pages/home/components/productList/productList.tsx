import {
  Button,
  Card,
  CardBody,
  CardFooter,
  Flex,
  Heading,
  Stack,
  Text,
  Image,
  Box,
  Badge,
} from "@chakra-ui/react";

import { StarIcon, ViewIcon } from "@chakra-ui/icons";
import { IProduct } from "../../../../types/product";
import useProducts from "../../../../hooks/useProducts";
import useCart from "../../../../hooks/useCart";
import useWishlist from "../../../../hooks/useWishlist";
import { Link } from "react-router-dom";

export const ProductList = () => {
  const { filteredItems, clearFilters, hasFilters } = useProducts();
  const { addItemToCart } = useCart();
  const { addToWishlist, wishedItems } = useWishlist();

  return (
    <Flex direction="column" gap={1} px={"2"} margin={"auto"} maxW={"1024px"}>
      <Flex gap={2} alignItems={"center"}>
        <Text>Total de produtos: {filteredItems.length}</Text>

        {hasFilters && (
          <>
            <Text>Tem filtros aplicados</Text>
            <Button variant={"ghost"} onClick={clearFilters}>
              Limpar filtros
            </Button>
          </>
        )}
      </Flex>

      {filteredItems.map((product) => {
        const isInWishList = wishedItems.some((item) => item.id === product.id);
        return (
          <Product
            product={product}
            key={product.id}
            onAddToCart={addItemToCart}
            onLike={addToWishlist}
            isFav={isInWishList}
          />
        );
      })}
    </Flex>
  );
};

const BROKEN_IMAGE_URL =
  "https://ps.w.org/replace-broken-images/assets/icon-256x256.png?rev=2561727";

const Product: React.FC<{
  product: IProduct;
  onAddToCart: (product: IProduct) => void;
  onLike: (product: IProduct) => void;
  isFav?: boolean;
}> = ({ product, onLike, isFav }) => {
  const { title, price, discountPercentage, category, brand, rating } = product;

  const discountedPrice = (price - price * (discountPercentage / 100)).toFixed(
    2
  );

  const addToFav = () => {
    onLike(product);
  };

  return (
    <Card
      size={"sm"}
      direction={{ base: "column", sm: "row" }}
      overflow="hidden"
      variant="outline"
    >
      <Box>
        <Image
          boxSize={"12rem"}
          width={"100%"}
          src={BROKEN_IMAGE_URL}
          fallbackSrc={BROKEN_IMAGE_URL}
          alt={title}
        ></Image>
      </Box>

      <Stack w={"full"}>
        <CardBody>
          <Heading size="md">{title}</Heading>
          <Flex flexDirection={"column"}>
            <Flex gap={2} alignItems={"baseline"}>
              <Text fontSize={"2xl"}>R$ {discountedPrice}</Text>
              <Text as={"del"}>R$ {price}</Text>
              <Text color={"red.200"}>{discountPercentage}% OFF!</Text>
            </Flex>
            <Text>Valoração {rating} / 5</Text>
            <Flex gap={2}>
              <Badge colorScheme="teal">{category}</Badge>
              <Badge colorScheme="teal">{brand}</Badge>
            </Flex>
          </Flex>
        </CardBody>

        <CardFooter gap={2} justifyContent={"right"}>
          <Button onClick={addToFav}>
            <StarIcon color={isFav ? "yellow.400" : "gray.300"}></StarIcon>
          </Button>

          <Button
            as={Link}
            gap={2}
            alignItems={"center"}
            to={`/item/${product.id}`}
          >
            Ver produto
            <ViewIcon />
          </Button>
        </CardFooter>
      </Stack>
    </Card>
  );
};
