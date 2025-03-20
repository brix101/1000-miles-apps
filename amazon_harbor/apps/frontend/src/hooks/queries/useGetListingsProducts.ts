import {
  IListingProductsQuery,
  getListingProductsQuery,
} from "@/services/listing.service";
import { ListingProductSummary } from "@repo/schema";
import {
  UseQueryOptions,
  UseQueryResult,
  useQuery,
} from "@tanstack/react-query";
import { AxiosError } from "axios";
import { useDebounce } from "usehooks-ts";

function useGetListingsProducts(
  query: IListingProductsQuery,
  options?: UseQueryOptions<ListingProductSummary[], AxiosError>
): UseQueryResult<ListingProductSummary[], AxiosError> {
  const debounceQuery = useDebounce(query);

  return useQuery({
    ...getListingProductsQuery(debounceQuery),
    ...options,
  });
}

export default useGetListingsProducts;
