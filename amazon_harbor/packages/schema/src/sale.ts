import { MoneyType } from ".";

export interface Money {
  amount: number;
  currencyCode: string;
}
export interface OrderMetricsInterval {
  interval: string;
  unitCount: number;
  orderItemCount: number;
  orderCount: number;
  averageUnitPrice: Money;
  totalSales: Money;
}

export interface OrderMetricsIntervalComparison {
  value: string;
  sales: OrderMetricsInterval;
  fees: MoneyType;
}

export interface ComparedPeriod {
  value: string;
  start: string;
  end: string;
}
