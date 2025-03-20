import {
  createSaleAndTrafficInterval,
  getSATComparisonInterval,
  parseFormatedInterval,
} from "@/services/amz-sale-traffic.service";
import { getSaleAndTraffic } from "@/services/sale-and-traffic.service";

import type { NextFunction, Request, Response } from "express";

export const getReturnsHandler = async (
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
        const refundRate = curr.salesByDate.refundRate;
        const refundAmount =
          curr.salesByDate.orderedProductSales.amount * (refundRate / 100);

        prev.totalRefundRate += refundRate;
        prev.totalUnits += curr.salesByDate.unitsRefunded;
        prev.totalReturns.amount += refundAmount;
        prev.totalReturns.currencyCode =
          curr.salesByDate.orderedProductSales.currencyCode;

        return prev;
      },
      {
        totalRefundRate: 0,
        totalUnits: 0,
        totalReturns: {
          amount: 0,
          currencyCode: "USD",
        },
      }
    );
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
        const refundRate = curr.salesByDate.refundRate;
        const refundAmount =
          curr.salesByDate.orderedProductSales.amount * (refundRate / 100);

        prev.totalRefundRate += refundRate;
        prev.totalUnits += curr.salesByDate.unitsRefunded;
        prev.totalReturns.amount += refundAmount;
        prev.totalReturns.currencyCode =
          curr.salesByDate.orderedProductSales.currencyCode;

        return prev;
      },
      {
        totalRefundRate: 0,
        totalUnits: 0,
        totalReturns: {
          amount: 0,
          currencyCode: "USD",
        },
      }
    );

    const comparisons = [
      {
        value: queryCompPeriod,
        returns: compSATResult,
      },
    ];

    return res.json({ returns: SATResult, comparisons });
  } catch (error) {
    next(error);
  }
};
