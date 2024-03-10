import { DeleteIcon, StarIcon } from "@chakra-ui/icons";
import {
  Flex,
  Spacer,
  Button,
  Box,
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerHeader,
  DrawerOverlay,
  Card,
  CardBody,
  CardFooter,
  Heading,
  Stack,
  Text,
  DrawerCloseButton,
  DrawerFooter,
  AlertDialog,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
} from "@chakra-ui/react";
import { useRef, useState } from "react";
import useWishlist from "../../hooks/useWishlist";
import useCart from "../../hooks/useCart";
import { Link } from "react-router-dom";

export const Header = () => {
  const [isShoppingCartOpen, setIsShoppingCartOpen] = useState(false);
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);

  return (
    <Flex bg={"orange.500"} alignItems={"baseline"} p={4}>
      <Box></Box>
      <Spacer />
      <Flex gap={1}>
        <Button gap={1} onClick={() => setIsShoppingCartOpen(true)}>
          <ShoppingCartIcon /> Carrinho
        </Button>
        <Button gap={1} onClick={() => setIsWishlistOpen(true)}>
          <StarIcon /> Desejos
        </Button>
      </Flex>
      <ShopingDrawer
        isOpen={isShoppingCartOpen}
        onClose={() => setIsShoppingCartOpen(false)}
      />
      <FavoritesDrawer
        isOpen={isWishlistOpen}
        onClose={() => setIsWishlistOpen(false)}
      />
    </Flex>
  );
};

const ShopingDrawer: React.FC<{ isOpen: boolean; onClose: () => void }> = ({
  isOpen,
  onClose,
}) => {
  const [isErasingCartOpen, setIsErasingCartOpen] = useState(false);
  const { cartItems, removeItemFromCart, clearCart } = useCart();
  const alertRef = useRef(null);

  const isEmpty = cartItems.length === 0;

  return (
    <Drawer onClose={onClose} isOpen={isOpen}>
      <DrawerOverlay />
      <DrawerContent>
        <DrawerHeader borderBottomWidth="1px">Carrinho</DrawerHeader>
        <DrawerBody display={"flex"} flexDirection={"column"} gap={2}>
          <DrawerCloseButton />

          {isEmpty && (
            <Text align={"center"} fontWeight={"bold"} fontSize={"lg"}>
              Você ainda não adicionou nenhum item ao carrinho.
            </Text>
          )}

          {cartItems.map((item) => (
            <Card variant="outline" key={item.id}>
              <Stack gap={2}>
                <CardBody p={2}>
                  <Flex justifyContent={"space-between"}>
                    <Box>
                      <Heading
                        onClick={() => {
                          onClose();
                        }}
                        size="sm"
                        as={Link}
                        to={`/item/${item.id}`}
                      >
                        {item.title}
                      </Heading>
                      <Text>Preço: R${item.price}</Text>
                    </Box>
                    <Box w={"fit-content"}>
                      <Button
                        onClick={() => removeItemFromCart(item.id)}
                        variant={"ghost"}
                      >
                        <DeleteIcon color={"red"}></DeleteIcon>
                      </Button>
                    </Box>
                  </Flex>
                </CardBody>
              </Stack>
            </Card>
          ))}
        </DrawerBody>

        <DrawerFooter gap={2}>
          <Button
            colorScheme="red"
            isDisabled={isEmpty}
            onClick={() => setIsErasingCartOpen(true)}
          >
            Vaziar tudo
          </Button>
        </DrawerFooter>
      </DrawerContent>

      <AlertDialog
        leastDestructiveRef={alertRef}
        isOpen={isErasingCartOpen}
        onClose={() => setIsErasingCartOpen(false)}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Vaziar carrinho
            </AlertDialogHeader>

            <AlertDialogBody>Quer mesmo vaziar o carrinho?</AlertDialogBody>

            <AlertDialogFooter>
              <Button onClick={() => setIsErasingCartOpen(false)}>
                Cancelar
              </Button>
              <Button
                colorScheme="red"
                onClick={() => {
                  clearCart();
                  setIsErasingCartOpen(false);
                }}
                ml={3}
              >
                Vaziar
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </Drawer>
  );
};

const FavoritesDrawer: React.FC<{ isOpen: boolean; onClose: () => void }> = ({
  isOpen,
  onClose,
}) => {
  const { wishedItems, removeFromWishlist, clearWishlist } = useWishlist();
  const { cartItems, addItemToCart } = useCart();
  const [isErasingWishlistOpen, setIsErasingWishlistOpen] = useState(false);

  const alertRef = useRef(null);

  const isEmpty = wishedItems.length === 0;

  return (
    <Drawer onClose={onClose} isOpen={isOpen}>
      <DrawerOverlay />
      <DrawerContent>
        <DrawerCloseButton />
        <DrawerHeader borderBottomWidth="1px">Lista de desejos</DrawerHeader>
        <DrawerBody display={"flex"} flexDirection={"column"} gap={2}>
          {isEmpty && (
            <Text align={"center"} fontWeight={"bold"} fontSize={"lg"}>
              Você ainda não tem itens na sua lista de desejos
            </Text>
          )}

          {wishedItems.map((item) => {
            const isInCart = cartItems.some(
              (cartItem) => cartItem.id === item.id
            );

            return (
              <Card variant="outline" key={item.id}>
                <Stack gap={2}>
                  <CardBody p={2}>
                    <Flex justifyContent={"space-between"}>
                      <Box>
                        <Heading
                          size="sm"
                          as={Link}
                          onClick={() => {
                            onClose();
                          }}
                          to={`/item/${item.id}`}
                        >
                          {item.title}
                        </Heading>
                        <Text>Preço: R${item.price}</Text>
                      </Box>
                      <Box w={"fit-content"}>
                        <Button
                          onClick={() => removeFromWishlist(item.id)}
                          variant={"ghost"}
                        >
                          <DeleteIcon color={"red"}></DeleteIcon>
                        </Button>
                      </Box>
                    </Flex>
                  </CardBody>

                  <CardFooter
                    p={2}
                    display={"flex"}
                    flexDirection={"column"}
                    gap={2}
                  >
                    <Button
                      isDisabled={isInCart}
                      onClick={() => addItemToCart(item)}
                    >
                      Adicionar ao carrinho
                    </Button>
                    {isInCart && (
                      <Text fontSize={"sm"}>Já está no carrinho!</Text>
                    )}
                  </CardFooter>
                </Stack>
              </Card>
            );
          })}
        </DrawerBody>

        <DrawerFooter gap={2}>
          <Button
            colorScheme="red"
            isDisabled={isEmpty}
            onClick={() => setIsErasingWishlistOpen(true)}
          >
            Vaziar tudo
          </Button>
        </DrawerFooter>
      </DrawerContent>

      <AlertDialog
        leastDestructiveRef={alertRef}
        isOpen={isErasingWishlistOpen}
        onClose={() => setIsErasingWishlistOpen(false)}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Vaziar lista de desejos
            </AlertDialogHeader>

            <AlertDialogBody>
              Quer mesmo vaziar a lista de desejos?
            </AlertDialogBody>

            <AlertDialogFooter>
              <Button onClick={() => setIsErasingWishlistOpen(false)}>
                Cancelar
              </Button>
              <Button
                colorScheme="red"
                onClick={() => {
                  clearWishlist();
                  setIsErasingWishlistOpen(false);
                }}
                ml={3}
              >
                Vaziar
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </Drawer>
  );
};

const ShoppingCartIcon = () => {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 576 512">
      <path d="M0 24C0 10.7 10.7 0 24 0H69.5c22 0 41.5 12.8 50.6 32h411c26.3 0 45.5 25 38.6 50.4l-41 152.3c-8.5 31.4-37 53.3-69.5 53.3H170.7l5.4 28.5c2.2 11.3 12.1 19.5 23.6 19.5H488c13.3 0 24 10.7 24 24s-10.7 24-24 24H199.7c-34.6 0-64.3-24.6-70.7-58.5L77.4 54.5c-.7-3.8-4-6.5-7.9-6.5H24C10.7 48 0 37.3 0 24zM128 464a48 48 0 1 1 96 0 48 48 0 1 1 -96 0zm336-48a48 48 0 1 1 0 96 48 48 0 1 1 0-96z" />
    </svg>
  );
};
