import { getListingsQuery } from "@/services/listing.service";
import { Listings } from "@/types/listing-product";
import {
  UseQueryOptions,
  UseQueryResult,
  useQuery,
} from "@tanstack/react-query";
import { AxiosError } from "axios";

function useGetListings(
  options?: UseQueryOptions<Listings[], AxiosError>
): UseQueryResult<Listings[], AxiosError> {
  return useQuery({
    ...getListingsQuery(),
    ...options,
  });
}

export default useGetListings;
