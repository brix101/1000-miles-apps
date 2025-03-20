import { getMarketplaceParticipationsQuery } from "@/services/marketplace.service";
import { MarketPlaceWithBrand } from "@repo/schema";
import {
  UseQueryOptions,
  UseQueryResult,
  useQuery,
} from "@tanstack/react-query";
import { AxiosError } from "axios";

function useGetMarketplacesParticipations(
  options?: UseQueryOptions<MarketPlaceWithBrand[], AxiosError>
): UseQueryResult<MarketPlaceWithBrand[], AxiosError> {
  return useQuery({
    ...getMarketplaceParticipationsQuery(),
    ...options,
  });
}

export default useGetMarketplacesParticipations;
