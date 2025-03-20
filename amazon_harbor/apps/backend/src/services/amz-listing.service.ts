import type { IProduct } from "@/models/product.model";
import apiSPInstance from "@/utils/api-sp-instance";
import createCache from "@/utils/cache.util";
import type {
  ListingProductDTO,
  ListingProductSummary,
  ProcurementIssue,
} from "@repo/schema";
import { getCompetitiveSummary } from "./amz-summary.service";

interface Pagination {
  nextToken?: string;
}
interface FetchItemsResponse {
  pagination?: Pagination;
  items: ListingProductDTO[];
}

export type IncludedData =
  | "attributes"
  | "dimensions"
  | "identifiers"
  | "images"
  | "productTypes"
  | "relationships"
  | "salesRanks"
  | "summaries"
  | "vendorDetails";

export interface ListingCatalogParams {
  identifiers: string;
  marketplaceId: string;
  includedData?: IncludedData[];
}

const catalogItemsCache = createCache<ListingProductDTO[]>();

/**
 * Retrieves catalog items based on provided identifiers and marketplace ID, with optional additional data included.
 * If the data for the given identifiers and marketplace ID is found in the cache, it's returned from the cache; otherwise,
 * it's fetched from the API, paginated if necessary, and stored in the cache for future use.
 * @param identifiers - Array of identifiers (e.g., ASINs) for the catalog items.
 * @param marketplaceId - The ID of the marketplace from which to retrieve the catalog items.
 * @param includedData - Optional. An array of additional data to include for each catalog item. Default is ["attributes", "images", "summaries", "salesRanks"].
 * @returns A Promise that resolves to an array of ListingProductDTO objects representing the retrieved catalog items.
 */
export async function getCatalogItem({
  identifiers,
  marketplaceId,
  includedData = ["attributes", "images", "summaries", "salesRanks"], // Default value
}: ListingCatalogParams): Promise<ListingProductDTO[]> {
  const cacheKey = `${marketplaceId}_${identifiers}`;

  // Check if data is already in the cache
  const cachedData = catalogItemsCache.get(cacheKey);
  if (cachedData) {
    return cachedData;
  }

  async function fetchItemsWithPagination(
    pageToken: string | undefined
  ): Promise<ListingProductDTO[]> {
    const response = await apiSPInstance.get<FetchItemsResponse>(
      "/catalog/2022-04-01/items",
      {
        params: {
          identifiers,
          identifiersType: "ASIN",
          marketplaceIds: marketplaceId,
          includedData: includedData.join(","),
          pageToken,
        },
      }
    );

    const { items, pagination } = response.data;
    const nextToken = pagination?.nextToken;
    const remainingItems = nextToken
      ? await fetchItemsWithPagination(nextToken)
      : [];

    const result = [...items, ...remainingItems];

    // Store data in the cache
    catalogItemsCache.set(cacheKey, result);

    return result;
  }

  return fetchItemsWithPagination(undefined);
}

export interface ListingItemsParams {
  products: IProduct[];
  marketplaceId?: string;
}

export interface ListingItemParams {
  sku: string;
  marketplaceIds: string;
}

const listingsItemCache = createCache<ListingProductSummary[]>();

/**
 * Retrieves listing product summaries for the specified listing reports and marketplace ID.
 * Caches the retrieved data for future use.
 * @param listingReports - The listing reports for which to retrieve product summaries.
 * @param marketplaceId - The ID of the marketplace for which to retrieve product summaries.
 * @returns An array of listing product summaries.
 */
export async function getListingsItems({
  products,
  marketplaceId = "ATVPDKIKX0DER",
}: ListingItemsParams): Promise<ListingProductSummary[]> {
  const cacheKey = `${marketplaceId}_${products.map((item) => item.asin).join("_")}`;

  // Check if data is already in the cache
  const cachedData = listingsItemCache.get(cacheKey);
  if (cachedData) {
    return cachedData;
  }

  const chunkSize = 20;

  const slicedProducts = Array.from(
    { length: Math.ceil(products.length / chunkSize) },
    (_, i) => {
      const start = i * chunkSize;
      const end = start + chunkSize;
      return products.slice(start, end);
    }
  ).filter((asins) => asins.length > 0);

  const competitiveSummaries = await getCompetitiveSummary();

  const items = (
    await Promise.all(
      slicedProducts.map(async (product): Promise<ListingProductSummary[]> => {
        const catalogItems = await getCatalogItem({
          marketplaceId,
          identifiers: product.map((item) => item.asin).join(", "),
        });

        const catalogItemsMapped = catalogItems.map((catalogItem) => {
          const attributes = catalogItem.attributes;
          const listing = product.find((x) => x.asin === catalogItem.asin);

          const summary = competitiveSummaries.find(
            (sum) =>
              sum.asin === catalogItem.asin &&
              sum.marketplaceId === marketplaceId
          );

          const itemPackageWeight = attributes.item_package_weight?.[0];
          const listPrice = attributes.list_price?.[0];

          const weight = itemPackageWeight?.value ?? 0.0;
          const price = summary?.listingPrice.amount ?? listPrice?.value ?? 0.0;

          return {
            ...catalogItem,
            ...catalogItem.summaries[0],
            sellerSku: listing?.sellerSku || "",
            status: listing?.status || "Inactive",
            assortmentNumber: listing?.assortmentNumber,
            weight,
            price,
          };
        });

        return catalogItemsMapped;
      })
    )
  ).flat();

  // Store data in the cache
  listingsItemCache.set(cacheKey, items);
  return items;
}

interface ListingItemResult {
  sku: string;
  issues: ProcurementIssue[];
}

const listingItemCache = createCache<ListingItemResult>();

export async function getListingItem({
  sku,
  marketplaceIds,
}: ListingItemParams) {
  const cacheKey = `listingItemCache_${marketplaceIds}_${sku}`;

  // Check if data is already in the cache
  const cachedData = listingItemCache.get(cacheKey);
  if (cachedData) {
    return cachedData;
  }
  try {
    const response = await apiSPInstance.get<ListingItemResult>(
      `/listings/2021-08-01/items/A3GQE6BD4MRWOE/${sku}`,
      {
        params: {
          marketplaceIds,
          includedData: "issues",
        },
      }
    );

    const item = response.data;
    listingItemCache.set(cacheKey, item);
    return item;
  } catch (error) {
    return { sku: "", issues: [] };
  }
}
