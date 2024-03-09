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

const BUTTON_WIDTH = "12";
export const Search = () => {
  const [areOptionsOpen, setAreOptionsOpen] = useState(false);
  const { categories, setFilter, filter: query, hasFilters } = useProducts();

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
      reset();
    },
    [hasFilters, reset]
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
            value={getFilterBy("price")}
            onChange={insertOrderQuery("price")}
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
            <Button colorScheme="red" onClick={() => reset({})}>
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

const MagnifyGlassIcon = () => {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 512 512">
      <path d="M416 208c0 45.9-14.9 88.3-40 122.7L502.6 457.4c12.5 12.5 12.5 32.8 0 45.3s-32.8 12.5-45.3 0L330.7 376c-34.4 25.2-76.8 40-122.7 40C93.1 416 0 322.9 0 208S93.1 0 208 0S416 93.1 416 208zM208 352a144 144 0 1 0 0-288 144 144 0 1 0 0 288z" />
    </svg>
  );
};

const SortIcon = () => {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 576 512">
      <path d="M151.6 42.4C145.5 35.8 137 32 128 32s-17.5 3.8-23.6 10.4l-88 96c-11.9 13-11.1 33.3 2 45.2s33.3 11.1 45.2-2L96 146.3V448c0 17.7 14.3 32 32 32s32-14.3 32-32V146.3l32.4 35.4c11.9 13 32.2 13.9 45.2 2s13.9-32.2 2-45.2l-88-96zM320 480h32c17.7 0 32-14.3 32-32s-14.3-32-32-32H320c-17.7 0-32 14.3-32 32s14.3 32 32 32zm0-128h96c17.7 0 32-14.3 32-32s-14.3-32-32-32H320c-17.7 0-32 14.3-32 32s14.3 32 32 32zm0-128H480c17.7 0 32-14.3 32-32s-14.3-32-32-32H320c-17.7 0-32 14.3-32 32s14.3 32 32 32zm0-128H544c17.7 0 32-14.3 32-32s-14.3-32-32-32H320c-17.7 0-32 14.3-32 32s14.3 32 32 32z" />
    </svg>
  );
};

const FilterIcon = () => {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 512 512">
      <path d="M0 416c0 17.7 14.3 32 32 32l54.7 0c12.3 28.3 40.5 48 73.3 48s61-19.7 73.3-48L480 448c17.7 0 32-14.3 32-32s-14.3-32-32-32l-246.7 0c-12.3-28.3-40.5-48-73.3-48s-61 19.7-73.3 48L32 384c-17.7 0-32 14.3-32 32zm128 0a32 32 0 1 1 64 0 32 32 0 1 1 -64 0zM320 256a32 32 0 1 1 64 0 32 32 0 1 1 -64 0zm32-80c-32.8 0-61 19.7-73.3 48L32 224c-17.7 0-32 14.3-32 32s14.3 32 32 32l246.7 0c12.3 28.3 40.5 48 73.3 48s61-19.7 73.3-48l54.7 0c17.7 0 32-14.3 32-32s-14.3-32-32-32l-54.7 0c-12.3-28.3-40.5-48-73.3-48zM192 128a32 32 0 1 1 0-64 32 32 0 1 1 0 64zm73.3-64C253 35.7 224.8 16 192 16s-61 19.7-73.3 48L32 64C14.3 64 0 78.3 0 96s14.3 32 32 32l86.7 0c12.3 28.3 40.5 48 73.3 48s61-19.7 73.3-48L480 128c17.7 0 32-14.3 32-32s-14.3-32-32-32L265.3 64z" />
    </svg>
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
