import apiSPInstance from "@/utils/api-sp-instance";
import createCache from "@/utils/cache.util";
import type { ListingProductDTO } from "@repo/schema";

interface Pagination {
  nextToken?: string;
}
interface FetchItemsResponse {
  pagination?: Pagination;
  items: ListingProductDTO[];
}

export interface SearchCatalogParams {
  brandName: string;
  marketplaceId: string;
  includedData?: (
    | "attributes"
    | "dimensions"
    | "identifiers"
    | "images"
    | "productTypes"
    | "relationships"
    | "salesRanks"
    | "summaries"
    | "vendorDetails"
  )[];
}

const catalogItemsCache = createCache<ListingProductDTO[]>();

/**
 * Searches catalog items based on the provided parameters.
 * @param brandName - The brand name to search for.
 * @param marketplaceId - The marketplace ID to search within.
 * @param includedData - The data to include in the search results (default: ["attributes", "images", "summaries", "salesRanks"]).
 * @returns A promise that resolves to an array of catalog items.
 */
export async function searchCatalogItems({
  brandName,
  marketplaceId,
  includedData = ["attributes", "images", "summaries", "salesRanks"], // Default value
}: SearchCatalogParams) {
  const cacheKey = `${brandName}_${marketplaceId}_${includedData.join("_")}`;

  // Check if data is already in the cache
  const cachedData = catalogItemsCache.get(cacheKey);
  if (cachedData) {
    return cachedData;
  }

  const keyword = `${brandName.split(" ")[0]},-`;

  async function fetchItemsWithPagination(
    pageToken: string | undefined
  ): Promise<ListingProductDTO[]> {
    const response = await apiSPInstance.get<FetchItemsResponse>(
      "/catalog/2022-04-01/items",
      {
        params: {
          includedData: includedData.join(","),
          marketplaceIds: marketplaceId,
          brandNames: brandName,
          keywords: keyword,
          pageToken,
        },
      }
    );

    const { items, pagination } = response.data;
    const nextToken = pagination?.nextToken;
    const remainingItems = nextToken
      ? await fetchItemsWithPagination(nextToken)
      : [];

    const result = items.concat(remainingItems);

    // Store data in the cache
    catalogItemsCache.set(cacheKey, result);

    return result;
  }

  return fetchItemsWithPagination(undefined);
}
