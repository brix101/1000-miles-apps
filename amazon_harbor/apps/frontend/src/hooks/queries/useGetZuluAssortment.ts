import { getZuluAssortmentQuery } from "@/services/zulu-assortment.service";
import { ZuluAssortment } from "@/types/zulu-assortment";
import {
  UseQueryOptions,
  UseQueryResult,
  useQuery,
} from "@tanstack/react-query";
import { AxiosError } from "axios";

function useGetZuluAssortment(
  assort: string,
  options?: UseQueryOptions<ZuluAssortment, AxiosError>
): UseQueryResult<ZuluAssortment, AxiosError> {
  return useQuery({
    ...getZuluAssortmentQuery(assort),
    enabled: assort !== "",
    ...options,
  });
}

export default useGetZuluAssortment;
