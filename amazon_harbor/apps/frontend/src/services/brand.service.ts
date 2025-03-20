import {
  QUERY_BRANDS_KEY,
  QUERY_MARKETPLACES_KEY,
} from "@/contant/query.contant";
import api from "@/lib/api";
import { ListingBrands } from "@/types/listing-brand";
import { BrandWithMarketplaces } from "@repo/schema";

export async function fetchBrands() {
  const res = await api.get<ListingBrands>("/brands");

  return res.data.items;
}

export async function fetchBrandsMarketplaces() {
  const res = await api.get<{ items: BrandWithMarketplaces[] }>(
    "/brands/marketplaces"
  );

  return res.data.items;
}

export const getBrandsQuery = () => ({
  queryKey: [QUERY_BRANDS_KEY],
  queryFn: fetchBrands,
});

export const getBrandsMarketplacesQuery = () => ({
  queryKey: [QUERY_BRANDS_KEY, QUERY_MARKETPLACES_KEY],
  queryFn: fetchBrandsMarketplaces,
});
