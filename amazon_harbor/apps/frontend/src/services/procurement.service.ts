import { QUERY_PROCUREMENT_PRODUCTS_KEY } from "@/contant/query.contant";
import api from "@/lib/api";
import { createObjectParams } from "@/lib/utils";
import { ProcurementProducts } from "@/types/procurement-product";

export interface IProcurementProductsQuery {
  brand?: string;
  marketplace?: string;
  status?: string;
}

export async function fetchProcurementProducts(
  query: IProcurementProductsQuery
) {
  const params = createObjectParams(query);
  const res = await api.get<ProcurementProducts>("/procurements/products", {
    params,
  });

  return res.data.items;
}

export const getProcurementProductsQuery = (
  query: IProcurementProductsQuery
) => ({
  queryKey: [QUERY_PROCUREMENT_PRODUCTS_KEY, query],
  queryFn: async () => fetchProcurementProducts(query),
});
