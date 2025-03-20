import { getBrandsQuery } from "@/services/brand.service";
import { BrandEntryDTO } from "@repo/schema";
import {
  UseQueryOptions,
  UseQueryResult,
  useQuery,
} from "@tanstack/react-query";
import { AxiosError } from "axios";

function useGetBrands(
  options?: UseQueryOptions<BrandEntryDTO[], AxiosError>
): UseQueryResult<BrandEntryDTO[], AxiosError> {
  return useQuery({
    ...getBrandsQuery(),
    ...options,
  });
}

export default useGetBrands;
