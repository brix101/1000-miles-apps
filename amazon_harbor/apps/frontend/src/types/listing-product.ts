import { InventorySummaries, ListingProductSummary } from "@repo/schema";

export interface ListingProducts {
  items: ListingProductSummary[];
}

export interface Dimension {
  unit: string;
  value: number;
}

export interface ItemDimensions {
  length?: Dimension;
  width?: Dimension;
  height?: Dimension;
  marketplace_id?: string;
}

export interface Listings {
  inventory: InventorySummaries | undefined;
  asin: string;
  status: string;
}
export interface ListingsResult {
  items: Listings[];
}
