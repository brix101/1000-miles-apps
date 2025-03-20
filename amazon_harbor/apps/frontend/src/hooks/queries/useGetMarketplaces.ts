import { getMarketplaceQuery } from "@/services/marketplace.service";
import { MarkerplaceExtendEntryDTO } from "@repo/schema";
import {
  UseQueryOptions,
  UseQueryResult,
  useQuery,
} from "@tanstack/react-query";
import { AxiosError } from "axios";

function useGetMarketplaces(
  options?: UseQueryOptions<MarkerplaceExtendEntryDTO[], AxiosError>
): UseQueryResult<MarkerplaceExtendEntryDTO[], AxiosError> {
  return useQuery({
    ...getMarketplaceQuery(),
    ...options,
  });
}

export default useGetMarketplaces;
