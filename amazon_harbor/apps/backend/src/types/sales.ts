import type { Money } from "@repo/schema";

export interface SalesAndTrafficReport {
  reportSpecification: ReportSpecification;
  salesAndTrafficByDate: SalesAndTrafficByDate[];
  salesAndTrafficByAsin: SalesAndTrafficByAsin[];
}

export interface ReportSpecification {
  reportType: string;
  reportOptions: {
    dateGranularity: string;
    asinGranularity: string;
  };
  dataStartTime: string;
  dataEndTime: string;
  marketplaceIds: string[];
}

export interface SalesAndTrafficByDate {
  date: string;
  salesByDate: {
    orderedProductSales: Money;
    unitsOrdered: number;
    totalOrderItems: number;
    averageSalesPerOrderItem: Money;
    averageUnitsPerOrderItem: number;
    averageSellingPrice: Money;
    unitsRefunded: number;
    refundRate: number;
    claimsGranted: number;
    claimsAmount: Money;
    shippedProductSales: Money;
    unitsShipped: number;
    ordersShipped: number;
  };
  trafficByDate: {
    browserPageViews: number;
    mobileAppPageViews: number;
    pageViews: number;
    browserSessions: number;
    mobileAppSessions: number;
    Moneysessions: number;
    buyBoxPercentage: number;
    orderItemSessionPercentage: number;
    unitSessionPercentage: number;
    averageOfferCount: number;
    averageParentItems: number;
    feedbackReceived: number;
    negativeFeedbackReceived: number;
    receivedNegativeFeedbackRate: number;
  };
}

export interface SalesAndTrafficByAsin {
  parentAsin: string;
  childAsin: string;
  sku: string;
  salesByAsin: {
    unitsOrdered: number;
    unitsOrderedB2B: number;
    orderedProductSales: Money;
    orderedProductSalesB2B: Money;
    totalOrderItems: number;
    totalOrderItemsB2B: number;
  };
  trafficByAsin: {
    browserPageViews: number;
    mobileAppPageViews: number;
    pageViews: number;
    browserSessions: number;
    mobileAppSessions: number;
    sessions: number;
    browserSessionPercentage: number;
    mobileAppSessionPercentage: number;
    sessionPercentage: number;
    browserPageViewsPercentage: number;
    mobileAppPageViewsPercentage: number;
    pageViewsPercentage: number;
    buyBoxPercentage: number;
    unitSessionPercentage: number;
  };
}
