import type { PrepDetails, Shipment, ShipmentItem } from "@repo/schema";

export interface ShipmentDataResult {
  payload: {
    NextToken?: string;
    ShipmentData: Shipment[];
  };
}

export interface ShipmentItemData {
  payload: {
    NextToken?: string;
    ItemData: ShipmentItem[];
  };
}

export type ReducedResult = Record<
  string,
  {
    SellerSKUs: string[];
    TotalQuantities: {
      Shipped: number;
      Received: number;
      InCase: number;
    };
    AllPrepDetailsList: PrepDetails[];
  }
>;
