import { getMyFeesEstimateForSKU } from "@/services/amz-fee.service";
import { getInventorySummaries } from "@/services/amz-inventory.service";
import { getListingsItems } from "@/services/amz-listing.service";
import {
  getComparisonInterval,
  getGranularityInterval,
  getOrderMetrics,
  parseQueryInterval,
} from "@/services/amz-sale.service";
import { getProducts } from "@/services/product.service";
import type {
  ComparedPeriod,
  OrderMetricsIntervalComparison,
} from "@repo/schema";

import type { NextFunction, Request, Response } from "express";

export const getOrderMetricsHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const marketplaceIds = (req.query.marketplace as string) || "ATVPDKIKX0DER"; // Use the query parameter or default to 'USA'
    const period = (req.query.period as string) || "YESTERDAY";
    const queryInterval = req.query.interval as string;
    const queryCompPeriod =
      (req.query.comparisonPeriod as string) || "LAST_WEEK";
    // const comparisonNumber = req.query.comparisonNumber as string;
    const queryCompInterval = req.query.comparisonInterval as string;

    const { granularity, interval } = getGranularityInterval(period);
    const parseInterval = parseQueryInterval(queryInterval);

    const orderMetrics = await getOrderMetrics({
      marketplaceIds,
      granularity,
      interval: parseInterval || interval,
    });

    const fees = await getMyFeesEstimateForSKU({
      MarketplaceId: marketplaceIds,
      SellerSKU: "0S-J3AH-7475",
      amount: orderMetrics.totalSales.amount,
    });

    const parseCompInterval = parseQueryInterval(queryCompInterval);
    const compInterval =
      parseCompInterval ||
      getComparisonInterval(queryCompPeriod, orderMetrics.interval);

    const comparisonItems = await getOrderMetrics({
      marketplaceIds,
      granularity,
      interval: compInterval,
    });

    const comparisonFees = await getMyFeesEstimateForSKU({
      MarketplaceId: marketplaceIds,
      SellerSKU: "0S-J3AH-7475",
      amount: comparisonItems.totalSales.amount,
    });

    const comparisons: OrderMetricsIntervalComparison[] = [
      {
        value: queryCompPeriod,
        sales: comparisonItems,
        fees: comparisonFees,
      },
    ];

    return res.json({ sales: orderMetrics, fees, comparisons });
  } catch (error) {
    next(error);
  }
};

export const getSalesByProductHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const marketplaceId = (req.query.marketplace as string) || "ATVPDKIKX0DER"; // Use the query parameter or default to 'USA'
    const period = (req.query.period as string) || "YESTERDAY";
    const queryInterval = req.query.interval as string;
    const queryCompPeriod =
      (req.query.comparisonPeriod as string) || "LAST_WEEK";
    // const comparisonNumber = req.query.comparisonNumber as string;
    const queryCompInterval = req.query.comparisonInterval as string;

    const inventories = await getInventorySummaries(marketplaceId);
    const products = await getProducts("Active");

    const listingsItems = await getListingsItems({
      products,
      marketplaceId,
    });

    const { granularity, interval } = getGranularityInterval(period);
    const parseInterval = parseQueryInterval(queryInterval);

    const listingPromises = listingsItems.map(async (item) => {
      const inventory = inventories.find((inv) => inv.asin === item.asin);
      const summary = item.summaries[0];

      const sales = await getOrderMetrics({
        marketplaceIds: marketplaceId,
        granularity,
        interval: parseInterval || interval,
        sku: item.sellerSku,
      });

      const fees = await getMyFeesEstimateForSKU({
        amount: sales.totalSales.amount,
        SellerSKU: item.sellerSku,
      });

      const parseCompInterval = parseQueryInterval(queryCompInterval);
      const compInterval =
        parseCompInterval ||
        getComparisonInterval(queryCompPeriod, sales.interval);

      const comparisonItems = await getOrderMetrics({
        marketplaceIds: marketplaceId,
        granularity,
        interval: compInterval,
        sku: item.sellerSku,
      });

      const comparisonFees = await getMyFeesEstimateForSKU({
        amount: comparisonItems.totalSales.amount,
        SellerSKU: item.sellerSku,
      });

      const comparisons: OrderMetricsIntervalComparison[] = [
        {
          value: queryCompPeriod,
          sales: comparisonItems,
          fees: comparisonFees,
        },
      ];

      return {
        asin: item.asin,
        summary,
        inventory,
        sales,
        comparisons,
        fees,
      };
    });

    const listingResults = await Promise.all(listingPromises);
    const items = listingResults.filter(({ sales }) => sales.unitCount > 0);
    const comparisons = items.length > 0 ? items[0]?.comparisons : [];
    const comparedPeriods: ComparedPeriod[] = comparisons.map((comparison) => {
      const sales = comparison.sales;

      const [start, end] = sales.interval.split("--");
      return {
        value: comparison.value,
        start,
        end,
      };
    });

    return res.json({ items, comparedPeriods });
  } catch (error) {
    next(error);
  }
};
