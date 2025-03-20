import {
  QUERY_SALES_AND_TRAFFIC_BY_PRODUCTS_KEY,
  QUERY_SALES_BY_PRODUCTS_KEY,
  QUERY_SALES_ORDER_METRIC_KEY,
  QUERY_SALE_AND_TRAFFIC_KEY,
} from "@/contant/query.contant";
import api from "@/lib/api";
import { createObjectParams } from "@/lib/utils";
import {
  OrderMetricResult,
  SaleAndTrafficByProductResult,
  SaleByProductResult,
  SalesAndTrafficResult,
} from "@/types/sale";

export interface ISalesOrderMetricQuery {
  marketplace?: string;
  period?: string;
  interval?: string | null;
  comparisonPeriod?: string | null;
  comparisonNumber?: string | null;
  comparisonInterval?: string | null;
}

export async function fetchSalesOrderMetric(query: ISalesOrderMetricQuery) {
  const params = createObjectParams(query);

  const res = await api.get<OrderMetricResult>("/sales/orderMetrics", {
    params,
  });

  return res.data;
}

export const getSalesOrderMetricQuery = (query: ISalesOrderMetricQuery) => ({
  queryKey: [QUERY_SALES_ORDER_METRIC_KEY, query],
  queryFn: async () => fetchSalesOrderMetric(query),
});

export async function fetchSalesByProduct(query: ISalesOrderMetricQuery) {
  const params = createObjectParams(query);
  const res = await api.get<SaleByProductResult>("/sales/salesByProducts", {
    params,
  });

  return res.data;
}

export const getSalesByProductQuery = (query: ISalesOrderMetricQuery) => ({
  queryKey: [QUERY_SALES_BY_PRODUCTS_KEY, query],
  queryFn: async () => fetchSalesByProduct(query),
});

export async function fetchSalesAndTrafficByProduct(
  query: ISalesOrderMetricQuery
) {
  const params = createObjectParams(query);
  const res = await api.get<SaleAndTrafficByProductResult>(
    "/sales/sale-and-traffic-by-product",
    {
      params,
    }
  );

  return res.data;
}

export const getSalesAndTrafficByProductQuery = (
  query: ISalesOrderMetricQuery
) => ({
  queryKey: [QUERY_SALES_AND_TRAFFIC_BY_PRODUCTS_KEY, query],
  queryFn: async () => fetchSalesAndTrafficByProduct(query),
});

export async function fetchSaleAndTraffic(query: ISalesOrderMetricQuery) {
  const params = createObjectParams(query);

  const res = await api.get<SalesAndTrafficResult>("/sales/sale-and-traffic", {
    params,
  });

  return res.data;
}

export const getSaleAndTrafficQuery = (query: ISalesOrderMetricQuery) => ({
  queryKey: [QUERY_SALE_AND_TRAFFIC_KEY, query],
  queryFn: async () => fetchSaleAndTraffic(query),
});
