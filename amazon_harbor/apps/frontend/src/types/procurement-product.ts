import { ListingProductSummary, ProcurementIssue } from "@repo/schema";

export interface AmazonInventoryError {
  message: string;
}

export interface AmazonInventoryStatus {
  name: "High" | "Low" | "Critical Low";
  error: AmazonInventoryError[];
}

export interface Note {
  message: string;
}

export interface ProcurementProduct extends ListingProductSummary {
  reservedInventory?: number;
  availableInvetory?: number;
  inboundToAmazon?: number;
  researching?: number;
  totAmazonInventory?: number;
  yiwuWarehouseInventory?: number;
  poQuantity?: number;
  amazonInventorySufficientUntil?: string;
  nextShipmentDate?: string;
  amazonInventoryStatus?: AmazonInventoryStatus;
  notes?: Note[];
  procurement: { sku: string; issues: ProcurementIssue[] };
}

export interface ProcurementProducts {
  items: ProcurementProduct[];
}
