import { useCartStore } from "../zustand/store";
import sortArray from "sort-array";
import _, { pick, size } from "underscore";
import { IProduct } from "../types/product";
import { useCallback } from "react";

export default function useProducts() {
  const [products, categories, query, setFilter, clearFilters] = useCartStore(
    (state) => [
      state.items,
      state.categories,
      state.filter,
      state.setFilter,
      state.clearFilters,
      state.filter,
    ]
  );

  const getFilteredItems = useCallback(
    (...params: FilterParams) => {
      const [rawName, rawWhere, rawOptions, rawRanges] = params;
      const filteredWhere = pick(rawWhere, (value) => value);
      const filteredOptions = pick(rawOptions, (value) => value);
      const filteredRanges = pick(rawRanges, (value) => value);
      const filteredSorting = filteredOptions?.sorting?.filter(
        (sort) => sort.order
      );

      return createFilter(products)(
        rawName,
        filteredWhere,
        { ...filteredOptions, sorting: filteredSorting },
        filteredRanges
      );
    },
    [products]
  );

  const { products: filteredItems } = getFilteredItems(
    query.q,
    {
      brand: query.brand,
      category: query.category,
    },
    {
      sorting: query.sorting,
    },
    {
      price: {
        min: query["min-price"] ? Number(query["min-price"]) : undefined,
        max: query["max-price"] ? Number(query["max-price"]) : undefined,
      },
      discountPercentage: {
        min: query["min-discount"] ? Number(query["min-discount"]) : undefined,
        max: query["max-discount"] ? Number(query["max-discount"]) : undefined,
      },
    }
  );

  const hasFilters = size(query) > 0;

  return {
    products,
    categories,
    filteredItems,
    setFilter,
    clearFilters,
    hasFilters,
    filter: query,
  };
}

type FilterParams = Parameters<ReturnType<typeof createFilter>>;
export type Orders = "asc" | "desc";

export type SortableValue = keyof Omit<IProduct, "images" | "title">;
export type NumericValues = keyof Pick<
  IProduct,
  "price" | "rating" | "stock" | "discountPercentage"
>;

export const VALID_SORTABLE_VALUES: SortableValue[] = [
  "brand",
  "category",
  "description",
  "discountPercentage",
  "id",
  "price",
  "rating",
  "stock",
];

// const NUMERIC_VALUES: NumericValues[] = [
//   "discountPercentage",
//   "price",
//   "stock",
//   "rating",
// ];

type Ranges = Record<NumericValues, { min?: number; max?: number }>;

export const VALID_SORTABLE_ORDERS: Orders[] = ["asc", "desc"];

const checkBetween =
  (min = Number.MIN_SAFE_INTEGER, max = Number.MAX_SAFE_INTEGER) =>
  (value: number) => {
    return value >= min && value <= max;
  };

const createFilter =
  (products: IProduct[]) =>
  (
    name?: string,
    where?: Partial<IProduct>,
    options?: {
      page?: number;
      size?: number;
      sorting?: {
        by: SortableValue;
        order: Orders;
      }[];
    },
    ranges?: Partial<Ranges>
  ) => {
    let searchedProducts = [...products];

    if (name) {
      const NO_CASE_SENSITIVE = "i";
      const regex = new RegExp(name, NO_CASE_SENSITIVE);
      searchedProducts = searchedProducts.filter(({ title }) =>
        regex.test(title)
      );
    }

    if (ranges) {
      type TestType = [NumericValues, { min: number; max: number }];
      const arrayRanges = Object.entries(ranges) as TestType[];

      searchedProducts = searchedProducts.filter((product) => {
        const isInRange = arrayRanges.every(([key, { min, max }]) => {
          const checkRange = checkBetween(min, max);
          return checkRange(product[key]);
        });
        return isInRange;
      });
    }

    if (where) {
      searchedProducts = _.where(searchedProducts, where);
    }

    if (options?.sorting) {
      const sorting = options.sorting ?? [];
      const [byValues, orderValues] = sorting.reduce(
        (prev, { by, order }) => {
          const byValues: SortableValue[] = [...prev[0], by];
          const orderValues: Orders[] = [...prev[1], order];
          return [byValues, orderValues] as [SortableValue[], Orders[]];
        },
        [[], []] as [SortableValue[], Orders[]]
      );

      searchedProducts = sortArray(searchedProducts, {
        by: byValues,
        order: orderValues,
      });
    }

    return {
      products: searchedProducts,
    };
  };
