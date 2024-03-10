import {
  Input,
  InputGroup,
  Flex,
  Button,
  Menu,
  MenuButton,
  MenuItemOption,
  MenuList,
  MenuOptionGroup,
  Drawer,
  DrawerBody,
  DrawerFooter,
  DrawerHeader,
  Box,
  DrawerCloseButton,
  DrawerContent,
  DrawerOverlay,
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  Select,
  Stack,
  Text,
} from "@chakra-ui/react";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import useProducts, {
  Orders,
  SortableValue,
} from "../../../../hooks/useProducts";
import {
  MagnifyGlassIcon,
  SortIcon,
  FilterIcon,
} from "../../../../components/icons";

const BUTTON_WIDTH = "12";
export const Search = () => {
  const [areOptionsOpen, setAreOptionsOpen] = useState(false);
  const {
    categories,
    setFilter,
    filter: query,
    hasFilters,
    clearFilters,
  } = useProducts();

  const {
    register,
    watch: getFormQuery,
    setValue,
    handleSubmit,
    reset,
  } = useForm<ProductQuery>({ values: query });

  const insertOrderQuery =
    (by: SortableValue) => (value: string | string[]) => {
      const parsedValue = Array.isArray(value) ? value[0] : value;
      const allQueries = form["sorting"] || [];
      const newQuery = [
        ...allQueries.filter((query) => query.by !== by),
        {
          by,
          order: parsedValue as Orders,
        },
      ];

      setValue("sorting", newQuery);
      applyFilters();
    };

  const form = getFormQuery();
  const applyFilters = () => {
    handleSubmit((form) => {
      setFilter(form);
    })();
  };

  useEffect(
    function resetFilter() {
      if (hasFilters) return;
      reset({});
    },
    [hasFilters, reset, query]
  );

  const getFilterBy = (by: SortableValue) => {
    const filter = form.sorting?.find((query) => query.by === by);
    return filter?.order ?? "";
  };

  return (
    <Flex py={"4"} px={"2"} gap={2} margin={"auto"} maxW={"1024px"}>
      <InputGroup role="searcher">
        <Input
          placeholder={SearcherText.SEARCH_BAR_PLACEHOLDER}
          defaultValue={query.q}
          {...register("q")}
          onKeyDown={(e) => {
            if (e.key === "Enter") applyFilters();
          }}
        />
      </InputGroup>

      <Button width={BUTTON_WIDTH} textAlign={"center"} onClick={applyFilters}>
        <MagnifyGlassIcon />
      </Button>
      <Menu closeOnSelect={false}>
        <MenuButton width={BUTTON_WIDTH} as={Button}>
          <Flex justify={"center"}>
            <SortIcon />
          </Flex>
        </MenuButton>
        <MenuList>
          <MenuOptionGroup
            title="Preço"
            type="radio"
            value={getFilterBy("discountedTotal")}
            onChange={insertOrderQuery("discountedTotal")}
          >
            <MenuItemOption value="">Nenhuma</MenuItemOption>
            <MenuItemOption value="asc">Ascendente</MenuItemOption>
            <MenuItemOption value="desc">Descendente</MenuItemOption>
          </MenuOptionGroup>
          <MenuOptionGroup
            type="radio"
            title="Desconto"
            value={getFilterBy("discountPercentage")}
            onChange={insertOrderQuery("discountPercentage")}
          >
            <MenuItemOption value="">Nenhuma</MenuItemOption>
            <MenuItemOption value="asc">Ascendente</MenuItemOption>
            <MenuItemOption value="desc">Descendente</MenuItemOption>
          </MenuOptionGroup>
          <MenuOptionGroup
            type="radio"
            value={getFilterBy("rating")}
            onChange={insertOrderQuery("rating")}
            title="Valoração"
          >
            <MenuItemOption value="">Nenhuma</MenuItemOption>
            <MenuItemOption value="asc">Ascendente</MenuItemOption>
            <MenuItemOption value="desc">Descendente</MenuItemOption>
          </MenuOptionGroup>
        </MenuList>
      </Menu>
      <Button width={BUTTON_WIDTH} onClick={() => setAreOptionsOpen(true)}>
        <FilterIcon />
      </Button>

      <Drawer
        placement="bottom"
        onClose={() => setAreOptionsOpen(false)}
        isOpen={areOptionsOpen}
      >
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader>Filtros</DrawerHeader>
          <DrawerBody>
            <Text>Categoria</Text>
            <Select
              placeholder={SearcherText.SELECT_CATEGORY_PLACEHOLDER}
              onChange={({ currentTarget }) => {
                setValue("category", currentTarget.value);
              }}
              value={form["category"] || ""}
            >
              {categories.map((category, index) => (
                <option key={index} value={category.value}>
                  {category.title}
                </option>
              ))}
            </Select>
            <Text>Marca</Text>
            <Select
              onChange={({ currentTarget }) =>
                setValue("brand", currentTarget.value)
              }
              value={form["brand"]}
              placeholder={SearcherText.SELECT_BRAND_PLACEHOLDER}
            >
              {categories
                .find((category) => category.value === form["category"])
                ?.brands.map((brand, index) => (
                  <option key={index} value={brand.value}>
                    {brand.title}
                  </option>
                ))}
            </Select>
            <Text>Price</Text>
            <Stack direction={"row"}>
              <Box>
                <Text>Min: </Text>
                <NumberInput
                  size="lg"
                  onChange={(value) => setValue("min-price", value)}
                  maxW={32}
                  value={form["min-price"] || ""}
                >
                  <NumberInputField />
                  <NumberInputStepper>
                    <NumberIncrementStepper />
                    <NumberDecrementStepper />
                  </NumberInputStepper>
                </NumberInput>
              </Box>
              <Box>
                <Text>Max: </Text>
                <NumberInput
                  onChange={(value) => setValue("max-price", value)}
                  size="lg"
                  maxW={32}
                  value={form["max-price"] || ""}
                >
                  <NumberInputField />
                  <NumberInputStepper>
                    <NumberIncrementStepper />
                    <NumberDecrementStepper />
                  </NumberInputStepper>
                </NumberInput>
              </Box>
            </Stack>

            <Text>Discount</Text>
            <Select
              placeholder={SearcherText.SELECT_DISCOUNT_PLACEHOLDER}
              value={form["min-discount"] || ""}
              onChange={({ currentTarget }) =>
                setValue("min-discount", currentTarget.value)
              }
            >
              <option value={"5"}>Maior ou igual do que 5%</option>
              <option value={"10"}>Maior ou igual do que 10%</option>
              <option value={"15"}>Maior ou igual do que 15%</option>
            </Select>
          </DrawerBody>

          <DrawerFooter gap={2}>
            <Button colorScheme="red" onClick={clearFilters}>
              Excluir filtros
            </Button>
            <Button
              onClick={() => {
                applyFilters();
                setAreOptionsOpen(false);
              }}
            >
              Aplicar filtros
            </Button>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </Flex>
  );
};

enum SearcherText {
  SEARCH_BAR_PLACEHOLDER = "O que você está procurando?",
  SELECT_CATEGORY_PLACEHOLDER = "Selecione categoria...",
  SELECT_BRAND_PLACEHOLDER = "Selecione marca...",
  SELECT_DISCOUNT_PLACEHOLDER = "Selecione desconto...",
}

export interface ProductQuery {
  q?: string;
  sorting?: {
    by: SortableValue;
    order: Orders;
  }[];
  order?: Orders;
  page?: number;
  size?: number | string;
  brand?: string;
  category?: string;
  discountPercentage?: number | string;
  price?: number | string;
  rating?: number | string;
  stock?: number | string;
  ["max-rating"]?: string | number;
  ["min-rating"]?: string | number;
  ["max-price"]?: string | number;
  ["min-price"]?: string | number;
  ["max-discount"]?: string | number;
  ["min-discount"]?: string | number;
  ["max-stock"]?: string | number;
  ["min-stock"]?: string | number;
}
