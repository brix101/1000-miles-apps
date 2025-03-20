import { getReturnQuery } from "@/services/return.service";
import { ISalesOrderMetricQuery } from "@/services/sale.service";
import { ReturnDataResult } from "@/types/return";
import {
  UseQueryOptions,
  UseQueryResult,
  useQuery,
} from "@tanstack/react-query";
import { AxiosError } from "axios";

function useGetReturn(
  query: ISalesOrderMetricQuery,
  options?: UseQueryOptions<ReturnDataResult, AxiosError>
): UseQueryResult<ReturnDataResult, AxiosError> {
  return useQuery({
    ...getReturnQuery(query),
    ...options,
  });
}

export default useGetReturn;
