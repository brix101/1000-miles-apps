import {
  ISalesOrderMetricQuery,
  getSalesOrderMetricQuery,
} from "@/services/sale.service";
import { OrderMetricResult } from "@/types/sale";
import {
  UseQueryOptions,
  UseQueryResult,
  useQuery,
} from "@tanstack/react-query";
import { AxiosError } from "axios";

function useGetSalesOrderMetric(
  query: ISalesOrderMetricQuery,
  options?: UseQueryOptions<OrderMetricResult, AxiosError>
): UseQueryResult<OrderMetricResult, AxiosError> {
  return useQuery({
    ...getSalesOrderMetricQuery(query),
    ...options,
  });
}

export default useGetSalesOrderMetric;
