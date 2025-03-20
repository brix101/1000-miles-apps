import {
  ISalesOrderMetricQuery,
  getSaleAndTrafficQuery,
} from "@/services/sale.service";
import { SalesAndTrafficResult } from "@/types/sale";
import {
  UseQueryOptions,
  UseQueryResult,
  useQuery,
} from "@tanstack/react-query";
import { AxiosError } from "axios";

function useGetSaleAndTraffic(
  query: ISalesOrderMetricQuery,
  options?: UseQueryOptions<SalesAndTrafficResult, AxiosError>
): UseQueryResult<SalesAndTrafficResult, AxiosError> {
  return useQuery({
    ...getSaleAndTrafficQuery(query),
    ...options,
  });
}

export default useGetSaleAndTraffic;
