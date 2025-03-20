import { getShipmentStatusesQuery } from "@/services/shipment.service";
import { SelectOption } from "@/types";
import {
  UseQueryOptions,
  UseQueryResult,
  useQuery,
} from "@tanstack/react-query";
import { AxiosError } from "axios";

function useGetShipmentStatuses(
  options?: UseQueryOptions<SelectOption[], AxiosError>
): UseQueryResult<SelectOption[], AxiosError> {
  return useQuery({
    ...getShipmentStatusesQuery(),
    ...options,
  });
}

export default useGetShipmentStatuses;
