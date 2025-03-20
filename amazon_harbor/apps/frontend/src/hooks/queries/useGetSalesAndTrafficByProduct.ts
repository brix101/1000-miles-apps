import {
  ISalesOrderMetricQuery,
  getSalesAndTrafficByProductQuery,
} from "@/services/sale.service";
import { SaleAndTrafficByProductResult } from "@/types/sale";
import {
  UseQueryOptions,
  UseQueryResult,
  useQuery,
} from "@tanstack/react-query";
import { AxiosError } from "axios";

function useGetSalesAndTrafficByProduct(
  query: ISalesOrderMetricQuery,
  options?: UseQueryOptions<SaleAndTrafficByProductResult, AxiosError>
): UseQueryResult<SaleAndTrafficByProductResult, AxiosError> {
  return useQuery({
    ...getSalesAndTrafficByProductQuery(query),
    select(data) {
      // SORT items by total sales
      const items = data.items.sort((productA, productB) => {
        const salesA = productA.sales?.unitsOrdered || 0;
        const salesB = productB.sales?.unitsOrdered || 0;
        return salesB - salesA;
      });
      return { ...data, items };
    },
    ...options,
  });
}

export default useGetSalesAndTrafficByProduct;
