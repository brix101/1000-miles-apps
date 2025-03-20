/* eslint-disable camelcase */
import apiZuluInstance from "@/utils/api-zulu-instance";
import createCache from "@/utils/cache.util";
import type { ZuluItem } from "@repo/schema";
import { getListingsItems } from "./amz-listing.service";
import { getGranularityInterval, getOrderMetrics } from "./amz-sale.service";
import { getProducts } from "./product.service";

const categorySummaryCache = createCache<
  {
    subCategory: string;
    parentCategory: string;
    totalSales: number;
  }[]
>();

export async function getCategorySummary(marketplaceId = "ATVPDKIKX0DER") {
  const cacheKey = `categorySummaryCache_${marketplaceId}`;

  const cachedData = categorySummaryCache.get(cacheKey);
  if (cachedData) {
    return cachedData;
  }

  const products = await getProducts("Active");

  const listingsItems = await getListingsItems({
    products,
    marketplaceId,
  });

  const { granularity, interval } = getGranularityInterval("MONTH");
  const assortItems = listingsItems
    .map((item) => item.attributes.model_number?.[0]?.value)
    .filter((value) => value !== undefined);

  const zuluResponse = await apiZuluInstance.get<{ data?: ZuluItem[] }>(
    "/zulu-amazon",
    {
      params: {
        assorts: JSON.stringify(assortItems),
      },
    },
  );

  const zuluData = zuluResponse.data.data || [];

  const result = await Promise.all(
    listingsItems.map(async (item) => {
      const attributes = item.attributes.model_number?.[0] || { value: 0 };
      const zulu = zuluData.find(
        (zItem) => zItem.item_number === attributes.value,
      );

      const sales = await getOrderMetrics({
        marketplaceIds: marketplaceId,
        granularity,
        interval,
        sku: item.sellerSku,
      });

      return {
        asin: item.asin,
        zulu,
        sales,
      };
    }),
  );

  const calculatedCategories = result.reduce<
    Record<string, { parentCategory: string; totalSales: number }>
  >((acc, item) => {
    const { sub_category = "Others", category = "Others" } = item.zulu || {};
    const totalSales = item.sales.totalSales.amount;
    acc[sub_category] = acc[sub_category] || {
      parentCategory: category,
      totalSales: 0,
    };

    acc[sub_category].totalSales += totalSales;

    return acc;
  }, {});

  const items = Object.entries(calculatedCategories)
    .map(([subCategory, { parentCategory, totalSales }]) => ({
      subCategory,
      parentCategory,
      totalSales,
    }))
    .filter((item) => item.totalSales > 0);

  categorySummaryCache.set(cacheKey, items);
  return items;
}
