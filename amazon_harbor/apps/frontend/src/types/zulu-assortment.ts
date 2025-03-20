export interface Mop {
  name: string;
  customer_delivery_date: string | false;
  latest_ven_delivery_date: string | false;
  actual_pack_date: string;
  product_qty: number;
  finish_pack_date: string;
  id: number;
  product_id: number;
  ready_date: string;
}

export interface Stock {
  item_number: string;
  location_str: string;
  product_id: number;
  reservation_status: string;
  qty: number;
  id: number;
}

export interface ZuluAssortment {
  item_number: string;
  category: string;
  name: string;
  mops: Mop[];
  stocks: Stock[];
  id: number;
  sub_category: string;
  amz_packaging_size?: string;
}
