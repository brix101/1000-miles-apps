import { IShipmentQuery, getShipmentsQuery } from "@/services/shipment.service";
import { ShipmentData } from "@/types/shipment";
import {
  UseQueryOptions,
  UseQueryResult,
  useQuery,
} from "@tanstack/react-query";
import { AxiosError } from "axios";
import { useDebounce } from "usehooks-ts";

function useGetShipments(
  query: IShipmentQuery,
  options?: UseQueryOptions<ShipmentData[], AxiosError>
): UseQueryResult<ShipmentData[], AxiosError> {
  const debouncedQuery = useDebounce(query);

  return useQuery({
    ...getShipmentsQuery(debouncedQuery),
    ...options,
  });
}

export default useGetShipments;
