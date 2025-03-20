import { PrepDetails, Shipment } from "@repo/schema";

export interface ShipmentData {
  shipment: Shipment | undefined;
  Shipped: number;
  Received: number;
  InCase: number;
  ShipmentId: string;
  SellerSKUs: string[];
  AllPrepDetailsList: PrepDetails[];
}
