import mongoose from "mongoose";

export interface SellerAccountInput {
  name: string;
  active: boolean;
}

export interface ISellerAccount extends SellerAccountInput, mongoose.Document {
  createdAt: Date;
  updatedAt: Date;
}

const sellerAccountSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    active: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

const SellerAccountModel = mongoose.model<ISellerAccount>(
  "SellerAccount",
  sellerAccountSchema
);

export default SellerAccountModel;
