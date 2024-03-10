import {
  Box,
  Button,
  Heading,
  Text,
  Image,
  Flex,
  Badge,
} from "@chakra-ui/react";
import { Grid, GridItem } from "@chakra-ui/react";
import { useParams } from "react-router-dom";
import useProducts from "../../hooks/useProducts";
import useWishlist from "../../hooks/useWishlist";
import useCart from "../../hooks/useCart";
import { ShoppingCartIcon } from "../../components/icons";
import { ArrowBackIcon, StarIcon } from "@chakra-ui/icons";

import { Link as ReactRouterLink } from "react-router-dom";
import { Link as ChakraLink } from "@chakra-ui/react";

const BROKEN_IMAGE_URL =
  "https://ps.w.org/replace-broken-images/assets/icon-256x256.png?rev=2561727";

export default function ItemPage() {
  const { id } = useParams();
  const { products, categories } = useProducts();
  const { addToWishlist, checkIfInWishList } = useWishlist();
  const { addItemToCart, checkIfCart } = useCart();
  const product = products.find((product) => product.id === Number(id));

  const foundCategory = categories.find(
    (category) => category.value === product?.category
  );

  if (!product) {
    return <div>Product not found</div>;
  }

  const isInWishList = checkIfInWishList(product);
  const isInCart = checkIfCart(product);

  return (
    <Grid
      p={4}
      templateColumns={{ sm: "1fr", md: "1fr 1fr" }}
      templateRows={"min-content 1fr"}
      height={"60vh"}
      margin={"auto"}
      maxW={"1024px"}
      gap={2}
    >
      <GridItem
        colSpan={{ sm: 1, md: 2 }}
        height={"fit-content"}
        display={"flex"}
        gap={2}
        alignItems={"baseline"}
      >
        <ArrowBackIcon />

        <ChakraLink
          as={ReactRouterLink}
          fontWeight={"bold"}
          fontSize={"2xl"}
          to={"/"}
        >
          Voltar
        </ChakraLink>
      </GridItem>
      <GridItem display={"flex"} justifyContent={"center"}>
        <Image aspectRatio={1} src={BROKEN_IMAGE_URL} />
      </GridItem>
      <GridItem
        backgroundColor={"gray.100"}
        borderRadius={4}
        p={2}
        display={"flex"}
        flexDirection={"column"}
        gap={2}
        justifyContent={"space-between"}
      >
        <Box>
          <Heading>{product.title}</Heading>
          <Text fontWeight={"bold"} fontSize={"2xl"}>
            R$ {product.price}
          </Text>

          <Flex gap={2}>
            <Badge colorScheme="red">{foundCategory?.title}</Badge>
            <Badge colorScheme="blue">{product.brand}</Badge>
          </Flex>

          <Text fontWeight={"bold"} fontSize={"1xl"}>
            Valoração {product.rating} / 5
          </Text>
          <Text>{product.description}</Text>
        </Box>

        <Flex gap={2} alignSelf={"flex-end"}>
          <Button
            variant="solid"
            colorScheme="orange"
            gap={1}
            onClick={() => addItemToCart(product)}
          >
            <ShoppingCartIcon fill={isInCart ? "white" : "black"} />
            {isInCart ? "Adicionado" : "Adicionar"}
          </Button>
          <Button
            variant="solid"
            colorScheme="orange"
            onClick={() => addToWishlist(product)}
            gap={1}
          >
            <StarIcon color={isInWishList ? "yellow.500" : "white"} />
            {isInWishList ? "Desejado" : "Desejar"}
          </Button>
        </Flex>
      </GridItem>
    </Grid>
  );
}
