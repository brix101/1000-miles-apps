import {
  QUERY_LISTING_KEY,
  QUERY_LISTING_PRODUCTS_KEY,
} from "@/contant/query.contant";
import api from "@/lib/api";
import { createObjectParams } from "@/lib/utils";
import { ListingProducts, ListingsResult } from "@/types/listing-product";

export interface IListingProductsQuery {
  brand?: string;
  status?: string;
}

export async function fetchListingProducts(query: IListingProductsQuery) {
  const params = createObjectParams(query);

  const res = await api.get<ListingProducts>("/listings/products", { params });

  return res.data.items;
}

export const getListingProductsQuery = (query: IListingProductsQuery) => ({
  queryKey: [QUERY_LISTING_PRODUCTS_KEY, query],
  queryFn: async () => fetchListingProducts(query),
});

export async function fetchListings() {
  const res = await api.get<ListingsResult>("/listings", {});

  return res.data.items;
}

export const getListingsQuery = () => ({
  queryKey: [QUERY_LISTING_KEY],
  queryFn: async () => fetchListings(),
});
