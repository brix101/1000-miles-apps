import { getMyFeesEstimateForSKU } from "@/services/amz-fee.service";
import { getListingsItems } from "@/services/amz-listing.service";
import {
  createSaleAndTrafficInterval,
  getSATComparisonInterval,
  parseFormatedInterval,
} from "@/services/amz-sale-traffic.service";
import { getProducts } from "@/services/product.service";
import { getSaleAndTraffic } from "@/services/sale-and-traffic.service";

import type { NextFunction, Request, Response } from "express";

export const getSaleAndTrafficHandler = async (
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
    const queryCompInterval = req.query.comparisonInterval as string;

    const parseInterval = parseFormatedInterval(queryInterval);
    const interval = parseInterval || createSaleAndTrafficInterval(period);

    const SATs = await getSaleAndTraffic({
      marketplaceId,
      dataEndTime: interval.dataEndTime,
      dataStartTime: interval.dataStartTime,
    });

    const SATResult = SATs.salesAndTrafficByDate.reduce(
      (prev, curr) => {
        prev.totalUnits += curr.salesByDate.unitsOrdered;
        prev.totalSales.amount += curr.salesByDate.orderedProductSales.amount;
        prev.totalSales.currencyCode =
          curr.salesByDate.orderedProductSales.currencyCode;

        return prev;
      },
      {
        totalUnits: 0,
        totalSales: {
          amount: 0,
          currencyCode: "USD",
        },
      }
    );

    const fees = await getMyFeesEstimateForSKU({
      MarketplaceId: marketplaceId,
      SellerSKU: "0S-J3AH-7475",
      amount: SATResult.totalSales.amount,
    });

    const spec = SATs.reportSpecification;
    const reportInterval = `${spec.dataStartTime}--${spec.dataEndTime}`;
    const parseCompInt = parseFormatedInterval(queryCompInterval);
    const compInterval =
      parseCompInt || getSATComparisonInterval(queryCompPeriod, reportInterval);

    const compSATs = await getSaleAndTraffic({
      marketplaceId,
      dataEndTime: compInterval.dataEndTime,
      dataStartTime: compInterval.dataStartTime,
    });

    const compSATResult = compSATs.salesAndTrafficByDate.reduce(
      (prev, curr) => {
        prev.totalUnits += curr.salesByDate.unitsOrdered;
        prev.totalSales.amount += curr.salesByDate.orderedProductSales.amount;
        prev.totalSales.currencyCode =
          curr.salesByDate.orderedProductSales.currencyCode;

        return prev;
      },
      {
        totalUnits: 0,
        totalSales: {
          amount: 0,
          currencyCode: "USD",
        },
      }
    );

    const compFees = await getMyFeesEstimateForSKU({
      MarketplaceId: marketplaceId,
      SellerSKU: "0S-J3AH-7475",
      amount: compSATResult.totalSales.amount,
    });

    const comparisons = [
      {
        value: queryCompPeriod,
        sales: compSATResult,
        fees: compFees,
      },
    ];

    return res.json({ sales: SATResult, fees, comparisons });
  } catch (error) {
    next(error);
  }
};

export const getSalesAndTrafficByProductHandler = async (
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

    const parseInterval = parseFormatedInterval(queryInterval);
    const interval = parseInterval || createSaleAndTrafficInterval(period);

    const products = await getProducts();

    const listingsItems = await getListingsItems({
      products,
      marketplaceId,
    });
    const SATs = await getSaleAndTraffic({
      marketplaceId,
      dataEndTime: interval.dataEndTime,
      dataStartTime: interval.dataStartTime,
    });

    const spec = SATs.reportSpecification;
    const reportInterval = `${spec.dataStartTime}--${spec.dataEndTime}`;
    const parseCompInt = parseFormatedInterval(queryCompInterval);
    const compInterval =
      parseCompInt || getSATComparisonInterval(queryCompPeriod, reportInterval);

    const compSATs = await getSaleAndTraffic({
      marketplaceId,
      dataEndTime: compInterval.dataEndTime,
      dataStartTime: compInterval.dataStartTime,
    });
    const defaultSalesData = {
      unitsOrdered: 0,
      unitsOrderedB2B: 0,
      orderedProductSales: {
        amount: 0,
        currencyCode: "USD",
      },
      orderedProductSalesB2B: {
        amount: 0,
        currencyCode: "USD",
      },
      totalOrderItems: 0,
      totalOrderItemsB2B: 0,
    };
    const comparedAsins = compSATs.salesAndTrafficByAsin;
    const queryItems = await Promise.all(
      SATs.salesAndTrafficByAsin.map(
        async ({ childAsin, sku, salesByAsin }) => {
          //Original Items Stats
          const item = listingsItems.find((lst) => lst.sellerSku === sku);
          const summary = item?.summaries[0];
          const images = item?.images || [];

          if (!summary) {
            return null;
          }

          const sales = salesByAsin;
          const fees = await getMyFeesEstimateForSKU({
            amount: sales.orderedProductSales.amount,
            SellerSKU: sku,
          });

          // Compared stats
          const compSales =
            comparedAsins.find((cItem) => cItem.sku === sku)?.salesByAsin ||
            defaultSalesData;

          const compFees = await getMyFeesEstimateForSKU({
            amount: compSales.orderedProductSales.amount,
            SellerSKU: sku,
          });

          const comparisons = [
            {
              value: queryCompPeriod,
              sales: compSales,
              fees: compFees,
            },
          ];

          return {
            asin: childAsin,
            sku,
            summary,
            sales,
            fees,
            comparisons,
            images,
          };
        }
      )
    );

    const items = queryItems.filter((item) => item !== null);

    const compSpec = compSATs.reportSpecification;

    const currentPeriod = {
      value: period,
      start: spec.dataStartTime,
      end: spec.dataEndTime,
    };

    const comparedPeriods = [
      {
        value: queryCompPeriod,
        start: compSpec.dataStartTime,
        end: compSpec.dataEndTime,
      },
    ];

    return res.json({ items, currentPeriod, comparedPeriods });
  } catch (error) {
    next(error);
  }
};
