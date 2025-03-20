import type { ShipmentData } from "@repo/schema";
import mongoose from "mongoose";

export interface ShipmentInput {
  key: string;
  shipmentData: ShipmentData[];
}

export interface IShipment extends ShipmentInput, mongoose.Document {
  createdAt: Date;
  updatedAt: Date;
}

const shipmentSchema = new mongoose.Schema(
  {
    key: {
      type: String,
      required: true,
      unique: true,
    },
    shipmentData: [
      {
        shipment: {
          ShipmentId: { type: String },
          ShipmentName: { type: String },
          ShipFromAddress: {
            Name: { type: String },
            AddressLine1: { type: String },
            AddressLine2: { type: String },
            DistrictOrCounty: { type: String },
            City: { type: String },
            StateOrProvinceCode: { type: String },
            CountryCode: { type: String },
            PostalCode: { type: String },
          },
          DestinationFulfillmentCenterId: { type: String },
          ShipmentStatus: { type: String },
          LabelPrepType: { type: String },
          BoxContentsSource: { type: String },
        },
        Shipped: { type: Number },
        Received: { type: Number },
        InCase: { type: Number },
        ShipmentId: { type: String },
        SellerSKUs: [{ type: String }],
        AllPrepDetailsList: [
          {
            PrepInstruction: { type: String },
            PrepOwner: { type: String },
          },
        ],
      },
    ],
  },
  {
    timestamps: true,
  }
);

const ShipmentModel = mongoose.model<IShipment>("Shipment", shipmentSchema);

export default ShipmentModel;
