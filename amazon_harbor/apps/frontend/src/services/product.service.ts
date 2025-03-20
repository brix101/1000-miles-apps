import { QUERY_PRODUCT_KEY } from "@/contant/query.contant";
import api from "@/lib/api";

export async function fetchProduct(asin: string) {
  const res = await api.get<{
    assortmentNumber?: string;
    sellerSku: string;
    asin: string;
  } | null>(`/products/${asin}`);

  return res.data;
}

export const getProductQuery = (asin: string) => ({
  queryKey: [QUERY_PRODUCT_KEY, asin],
  queryFn: async () => fetchProduct(asin),
});

export type ProductData = {
  assortmentNumber?: string;
  yiwuWarehouseInventory?: number;
  poQuantity?: number;
  poReadyDate?: string;
  avgCOG?: number;
  shippingCost?: number;
  manufacturingLeadtime?: string;
  safetyLeadTime?: string;
  deliveryTime?: string;
  deliveryFee?: number;
};

export async function updateProduct({
  asin,
  data,
}: {
  asin: string;
  data: ProductData;
}) {
  return await api.put(`/products/${asin}`, data, {});
}
