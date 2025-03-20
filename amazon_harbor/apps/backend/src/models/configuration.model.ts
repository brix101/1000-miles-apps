import mongoose from "mongoose";

export interface CofigurationInput {
  roas: number;
  acos: number;
}

export interface ICofiguration extends CofigurationInput, mongoose.Document {
  createdAt: Date;
  updatedAt: Date;
}

const cofigurationSchema = new mongoose.Schema(
  {
    roas: {
      type: mongoose.Types.Decimal128,
      required: true,
    },
    acos: {
      type: mongoose.Types.Decimal128,
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

const CofigurationModel = mongoose.model<ICofiguration>(
  "Cofiguration",
  cofigurationSchema
);

export default CofigurationModel;
