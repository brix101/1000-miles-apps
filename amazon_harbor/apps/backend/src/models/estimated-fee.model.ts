import type { MoneyType } from "@repo/schema";
import mongoose from "mongoose";

export interface EstimatedFeeInput {
  key: string;
  totalFeesEstimate: MoneyType;
}

export interface IEstimatedFee extends EstimatedFeeInput, mongoose.Document {
  createdAt: Date;
  updatedAt: Date;
}

const estimatedFeeSchema = new mongoose.Schema(
  {
    key: {
      type: String,
      required: true,
      unique: true,
    },
    totalFeesEstimate: {
      CurrencyCode: {
        type: String,
        required: true,
      },
      Amount: {
        type: Number,
        required: true,
      },
    },
  },
  {
    timestamps: true,
  }
);

const EstimatedFeeModel = mongoose.model<IEstimatedFee>(
  "EstimatedFee",
  estimatedFeeSchema
);

export default EstimatedFeeModel;
