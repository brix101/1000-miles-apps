import {
  ComparedPeriod,
  Image,
  InventorySummaries,
  Money,
  MoneyType,
  OrderMetricsInterval,
  OrderMetricsIntervalComparison,
} from "@repo/schema";

export interface OrderMetricResult {
  sales: OrderMetricsInterval;
  fees?: MoneyType;
  comparisons: OrderMetricsIntervalComparison[];
}

export interface SalesReduced {
  totalUnits: number;
  totalSales: Money;
}

export interface SaleAndTrafficComparison {
  value: string;
  fees: MoneyType;
  sales: SalesReduced;
}
export interface SalesAndTrafficResult {
  sales: SalesReduced;
  fees?: MoneyType;
  comparisons: SaleAndTrafficComparison[];
}
export interface SaleByProduct {
  asin: string;
  summary: any;
  inventory: InventorySummaries;
  sales?: OrderMetricsInterval;
  fees?: MoneyType;
  comparisons?: OrderMetricsIntervalComparison[];
}

export interface SaleByAsin {
  unitsOrdered: number;
  unitsOrderedB2B: number;
  orderedProductSales: {
    amount: number;
    currencyCode: string;
  };
  orderedProductSalesB2B: {
    amount: number;
    currencyCode: string;
  };
  totalOrderItems: number;
  totalOrderItemsB2B: number;
}
export interface SaleAndTrafficByProduct {
  asin: string;
  summary: any;
  images: Image[];
  sales?: SaleByAsin;
  fees?: MoneyType;
  comparisons?: { value: string; sales: SaleByAsin; fees: MoneyType }[];
}

export interface SaleByProductResult {
  items: SaleByProduct[];
  comparedPeriods: ComparedPeriod[];
}

export interface SaleAndTrafficByProductResult {
  items: SaleAndTrafficByProduct[];
  currentPeriod: ComparedPeriod;
  comparedPeriods: ComparedPeriod[];
}
