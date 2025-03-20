import {
  IProcurementProductsQuery,
  getProcurementProductsQuery,
} from "@/services/procurement.service";
import { ProcurementProduct } from "@/types/procurement-product";
import {
  UseQueryOptions,
  UseQueryResult,
  useQuery,
} from "@tanstack/react-query";
import { AxiosError } from "axios";
import { useDebounce } from "usehooks-ts";

function useGetProcurementsProducts(
  query: IProcurementProductsQuery,
  options?: UseQueryOptions<ProcurementProduct[], AxiosError>
): UseQueryResult<ProcurementProduct[], AxiosError> {
  const debounceQuery = useDebounce(query);
  return useQuery({
    ...getProcurementProductsQuery(debounceQuery),
    ...options,
  });
}

export default useGetProcurementsProducts;
