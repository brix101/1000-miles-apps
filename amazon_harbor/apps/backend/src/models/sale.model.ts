import type { OrderMetricsInterval } from "@repo/schema";
import mongoose from "mongoose";

export interface SaleInput {
  key: string;
  orderMetrics: OrderMetricsInterval[];
}

export interface ISale extends SaleInput, mongoose.Document {
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
    orderMetrics: [
      {
        interval: {
          type: String,
        },
        unitCount: {
          type: Number,
          default: 0,
        },
        orderItemCount: {
          type: Number,
          default: 0,
        },
        orderCount: {
          type: Number,
          default: 0,
        },
        averageUnitPrice: {
          amount: {
            type: Number,
            default: 0,
          },
          currencyCode: {
            type: String,
            default: "USD",
          },
        },
        totalSales: {
          amount: {
            type: Number,
            default: 0,
          },
          currencyCode: {
            type: String,
            default: "USD",
          },
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

const SaleModel = mongoose.model<ISale>("Sale", saleSchema);

export default SaleModel;
