import type { ZuluItem } from "@repo/schema";

export interface Stock {
  item_number: string;
  location_str: string;
  product_id: number;
  reservation_status: string;
  qty: number;
  id: number;
}

export interface Mop {
  name: string;
  customer_delivery_date: boolean;
  latest_ven_delivery_date: string;
  ready_date: boolean;
  actual_pack_date: string;
  product_qty: number;
  finish_pack_date: string;
  id: number;
  product_id: number;
}

export interface ZuluAssortment extends ZuluItem {
  amz_packaging_size: boolean;
  stocks: Stock[];
  mops: Mop[];
  id: number;
}
