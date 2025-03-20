export interface Shipment {
  ShipmentId: string;
  ShipmentName: string;
  ShipFromAddress: {
    Name: string;
    AddressLine1: string;
    AddressLine2?: string;
    DistrictOrCounty?: string;
    City: string;
    StateOrProvinceCode?: string;
    CountryCode: string;
    PostalCode: string;
  };
  DestinationFulfillmentCenterId: string;
  ShipmentStatus: string;
  LabelPrepType: string;
  BoxContentsSource: string;
}

export interface ShipmentItem {
  ShipmentId: string;
  SellerSKU: string;
  FulfillmentNetworkSKU: string;
  QuantityShipped: number;
  QuantityReceived: number;
  QuantityInCase: number;
  PrepDetailsList: PrepDetails[];
}

export interface PrepDetails {
  PrepInstruction: string;
  PrepOwner: string;
}

export interface ShipmentData {
  shipment: Shipment | undefined;
  Shipped: number;
  Received: number;
  InCase: number;
  ShipmentId: string;
  SellerSKUs: string[];
  AllPrepDetailsList: PrepDetails[];
}
