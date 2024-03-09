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
  useToast,
} from "@chakra-ui/react";

import { AddIcon, StarIcon, ViewIcon } from "@chakra-ui/icons";
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
            onAddToCart={({ id }) => addItemToCart(id)}
            onLike={({ id }) => addToWishlist(id)}
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
}> = ({ product, onLike, onAddToCart, isFav }) => {
  const { title, price, discountPercentage } = product;

  const discountedPrice = (price - price * (discountPercentage / 100)).toFixed(
    2
  );

  const toast = useToast();
  const addToFav = () => {
    if (isFav) {
      toast({
        title: ToastMessages.ALREADY_LIKED_TITLE,
        isClosable: true,
      });

      return;
    }
    onLike(product);
    toast({
      title: ToastMessages.ADDED_TO_FAV_TITLE,
      isClosable: true,
      description: ToastMessages.ADDED_TO_FAV_DESC.replace(
        "{productName}",
        title
      ),
      status: "success",
    });
  };

  const addToCart = () => {
    onAddToCart(product);
    toast({
      title: ToastMessages.ADDED_TO_CART_TITLE,
      isClosable: true,
      status: "success",
      description: ToastMessages.ADDED_TO_CART_DESC.replace(
        "{productName}",
        title
      ),
    });
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
          <Flex gap={2} alignItems={"baseline"}>
            <Text fontSize={"2xl"}>R$ {discountedPrice}</Text>
            <Text as={"del"}>R$ {price}</Text>
            <Text color={"red.200"}>{discountPercentage}% OFF!</Text>
          </Flex>
        </CardBody>

        <CardFooter gap={2} justifyContent={"right"}>
          <Button onClick={addToFav}>
            <StarIcon color={isFav ? "yellow.400" : "gray.300"}></StarIcon>
          </Button>
          <Button onClick={addToCart}>
            <AddIcon />
          </Button>

          <Button as={Link} to={`/item/${product.id}`}>
            <ViewIcon />
          </Button>
        </CardFooter>
      </Stack>
    </Card>
  );
};

enum ToastMessages {
  ADDED_TO_FAV_TITLE = "Curtiu mesmo!",
  ADDED_TO_FAV_DESC = "Seu item {productName} foi adicionado aos favoritos!",
  ADDED_TO_CART_TITLE = "Adicionado ao carrinho!",
  ADDED_TO_CART_DESC = "Seu item {productName} foi adicionado ao carrinho!",
  ALREADY_LIKED_TITLE = "Opa! Você já curtiu isso.",
}
