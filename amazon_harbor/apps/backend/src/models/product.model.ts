import mongoose from "mongoose";
import type { ICompany } from "./company.model";

export interface ProductInput {
  sellerSku: string;
  asin: string;
  assortmentNumber: string;
  status: string;
  yiwuWarehouseInventory?: number;
  poQuantity?: number;
  poReadyDate?: string;
  avgCOG?: number;
  shippingCost?: number;
  manufacturingLeadtime?: string;
  safetyLeadTime?: string;
  deliveryTime?: string;
  deliveryFee?: string;
  company: ICompany["_id"];
}

export interface IProduct extends ProductInput, mongoose.Document {
  createdAt: Date;
  updatedAt: Date;
}

const productSchema = new mongoose.Schema(
  {
    sellerSku: {
      type: String,
      required: true,
    },
    asin: {
      type: String,
      required: true,
      unique: true, // Ensure uniqueness of asin
    },
    assortmentNumber: {
      type: String,
    },
    yiwuWarehouseInventory: {
      type: Number,
      default: 0,
    },
    poQuantity: {
      type: Number,
      default: 0,
    },
    poReadyDate: {
      type: String,
    },
    status: {
      type: String,
    },
    avgCOG: {
      type: Number,
      default: 0,
    },
    shippingCost: {
      type: Number,
      default: 0,
    },
    manufacturingLeadtime: {
      type: String,
      default: "25 days",
    },
    safetyLeadTime: {
      type: String,
      default: "7 days",
    },
    deliveryTime: {
      type: String,
      default: "30 days",
    },
    deliveryFee: {
      type: Number,
      default: 0.5,
    },
    company: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Company",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const ProductModel = mongoose.model<IProduct>("Product", productSchema);

export default ProductModel;
