import {
  ISalesOrderMetricQuery,
  getSalesByProductQuery,
} from "@/services/sale.service";
import { SaleByProductResult } from "@/types/sale";
import {
  UseQueryOptions,
  UseQueryResult,
  useQuery,
} from "@tanstack/react-query";
import { AxiosError } from "axios";

function useGetSalesByProduct(
  query: ISalesOrderMetricQuery,
  options?: UseQueryOptions<SaleByProductResult, AxiosError>
): UseQueryResult<SaleByProductResult, AxiosError> {
  return useQuery({
    ...getSalesByProductQuery(query),
    select(data) {
      const items = data.items.sort((productA, productB) => {
        const salesA = productA.sales?.totalSales.amount || 0;
        const salesB = productB.sales?.totalSales.amount || 0;
        return salesB - salesA;
      });
      return { ...data, items };
    },
    ...options,
  });
}

export default useGetSalesByProduct;
