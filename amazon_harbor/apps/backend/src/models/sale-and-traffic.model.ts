import mongoose from "mongoose";

import type {
  ReportSpecification,
  SalesAndTrafficByAsin,
  SalesAndTrafficByDate,
} from "@/types/sales";

export interface SaleAndTrafficInput {
  key: string;
  reportSpecification: ReportSpecification;
  salesAndTrafficByDate: SalesAndTrafficByDate[];
  salesAndTrafficByAsin: SalesAndTrafficByAsin[];
}

export interface ISaleAndTraffic
  extends SaleAndTrafficInput,
    mongoose.Document {
  createdAt: Date;
  updatedAt: Date;
}

const saleSchema = new mongoose.Schema(
  {
    key: {
      type: String,
      required: true,
      unique: true,
    },
    reportSpecification: {
      type: mongoose.Schema.Types.Mixed,
      required: true,
    },
    salesAndTrafficByDate: [
      {
        type: mongoose.Schema.Types.Mixed,
        required: true,
      },
    ],
    salesAndTrafficByAsin: [
      {
        type: mongoose.Schema.Types.Mixed,
        required: true,
      },
    ],
  },
  {
    timestamps: true,
  }
);

const SaleAndTrafficModel = mongoose.model<ISaleAndTraffic>(
  "SaleAndTraffic",
  saleSchema
);

export default SaleAndTrafficModel;
