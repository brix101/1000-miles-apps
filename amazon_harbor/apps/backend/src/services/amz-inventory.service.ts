import { apiInstance } from "@/utils/api-instance";
import createCache from "@/utils/cache.util";
import type { InventorySummaries } from "@repo/schema";
import { getCompaniesToken } from "./company.service";

interface InventorySummariesResponse {
  payload: {
    inventorySummaries: InventorySummaries[];
  };
}

const inventoryCache = createCache<InventorySummaries[]>();

/**
 * Retrieves inventory summaries for the specified marketplace IDs from the API.
 * Caches the retrieved data for future use.
 * @param marketplaceIds - The IDs of the marketplaces for which to retrieve inventory summaries.
 * @returns An array of inventory summaries.
 */
export async function getInventorySummaries(marketplaceIds: string) {
  // Generate cache key based on marketplace IDs
  const cacheKey = `inventory_${marketplaceIds}`;

  // Check if data is cached
  const cachedData = inventoryCache.get(cacheKey);
  if (cachedData) {
    // Return cached data if available
    return cachedData;
  }

  const companies = await getCompaniesToken();

  const companyItems = await Promise.all(
    companies.map(async (company) => {
      const response = await apiInstance.get<InventorySummariesResponse>(
        "/fba/inventory/v1/summaries",
        {
          params: {
            details: true,
            granularityType: "Marketplace",
            granularityId: marketplaceIds,
            marketplaceIds,
          },
          headers: {
            "x-amz-access-token": company.lwa.accessToken,
          },
        }
      );

      return response.data.payload.inventorySummaries;
    })
  );

  // Extract inventory summaries from the response
  const items = companyItems.flat();

  // Cache the retrieved data for future use
  inventoryCache.set(cacheKey, items);

  // Return the retrieved inventory summaries
  return items;
}

export const defaultInvetorySummary: InventorySummaries = {
  asin: "",
  fnSku: "",
  sellerSku: "",
  condition: "",
  inventoryDetails: {
    fulfillableQuantity: 0,
    inboundWorkingQuantity: 0,
    inboundShippedQuantity: 0,
    inboundReceivingQuantity: 0,
    reservedQuantity: {
      totalReservedQuantity: 0,
      pendingCustomerOrderQuantity: 0,
      pendingTransshipmentQuantity: 0,
      fcProcessingQuantity: 0,
    },
    researchingQuantity: {
      totalResearchingQuantity: 0,
      researchingQuantityBreakdown: [],
    },
    unfulfillableQuantity: {
      totalUnfulfillableQuantity: 0,
      customerDamagedQuantity: 0,
      warehouseDamagedQuantity: 0,
      distributorDamagedQuantity: 0,
      carrierDamagedQuantity: 0,
      defectiveQuantity: 0,
      expiredQuantity: 0,
    },
    futureSupplyQuantity: {
      reservedFutureSupplyQuantity: 0,
      futureSupplyBuyableQuantity: 0,
    },
  },
  lastUpdatedTime: "",
  productName: "",
  totalQuantity: 0,
};
