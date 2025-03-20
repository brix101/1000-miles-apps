import { getBrandsMarketplacesQuery } from "@/services/brand.service";
import { BrandWithMarketplaces } from "@repo/schema";
import {
  UseQueryOptions,
  UseQueryResult,
  useQuery,
} from "@tanstack/react-query";
import { AxiosError } from "axios";

function useGetBrandsMarketplaces(
  options?: UseQueryOptions<BrandWithMarketplaces[], AxiosError>
): UseQueryResult<BrandWithMarketplaces[], AxiosError> {
  return useQuery({
    ...getBrandsMarketplacesQuery(),
    ...options,
  });
}

export default useGetBrandsMarketplaces;
