import mongoose from "mongoose";

export enum ReportType {
  ADS = "ADS",
  SP = "SP",
  ListingPrice = "ListingPrice",
}

export interface ReportInput {
  key?: string;
  type: ReportType;
  data: string;
}

export interface IReport extends ReportInput, mongoose.Document {
  createdAt: Date;
  updatedAt: Date;
}

const reportSchema = new mongoose.Schema(
  {
    key: {
      type: String,
    },
    type: {
      type: String,
      enum: Object.values(ReportType),
      required: true,
    },
    data: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const ReportModel = mongoose.model<IReport>("Report", reportSchema);

export default ReportModel;
