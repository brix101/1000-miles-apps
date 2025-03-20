import mongoose from "mongoose";

export interface BrandInput {
  name: string;
}

export interface IBrand extends BrandInput, mongoose.Document {
  createdAt: Date;
  updatedAt: Date;
}

const brandSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
  },
  {
    timestamps: true,
  }
);

const BrandModel = mongoose.model<IBrand>("Brand", brandSchema);

export default BrandModel;
