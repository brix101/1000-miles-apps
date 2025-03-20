import {
  QUERY_SHIPMENTS_KEY,
  QUERY_SHIPMENT_STATUSES_KEY,
} from "@/contant/query.contant";
import api from "@/lib/api";
import { createObjectParams } from "@/lib/utils";
import { SelectOption } from "@/types";
import { ShipmentData } from "@/types/shipment";

export interface IShipmentQuery {
  status?: string;
  sellerSku?: string;
}

export async function fetchShipments(query: IShipmentQuery) {
  const params = createObjectParams(query);

  const res = await api.get<{ items: ShipmentData[] }>("/shipments", {
    params,
  });

  return res.data.items;
}

export async function fetchShipmentStatuses() {
  const res = await api.get<{ items: SelectOption[] }>("/shipments/statuses");

  return res.data.items;
}

export const getShipmentsQuery = (query: IShipmentQuery) => ({
  queryKey: [QUERY_SHIPMENTS_KEY, query],
  queryFn: async () => fetchShipments(query),
});

export const getShipmentStatusesQuery = () => ({
  queryKey: [QUERY_SHIPMENT_STATUSES_KEY],
  queryFn: fetchShipmentStatuses,
});
