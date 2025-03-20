import mongoose from "mongoose";

export interface ModuleInput {
  name: string;
}

export interface IModule extends ModuleInput, mongoose.Document {
  createdAt: Date;
  updatedAt: Date;
}

const moduleSchema = new mongoose.Schema(
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

const ModuleModel = mongoose.model<IModule>("Module", moduleSchema);

export default ModuleModel;
