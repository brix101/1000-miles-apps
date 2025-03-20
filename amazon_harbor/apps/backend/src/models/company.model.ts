import mongoose from "mongoose";

export interface CompanyInput {
  name: string;
  lwa: {
    clientId: string;
    clientSecret: string;
    refreshToken: string;
    accessToken?: string | null;
    expiresAt?: Date;
  };
  ads: {
    redirectUri: string;
    clientId: string;
    clientSecret: string;
    refreshToken: string;
    accessToken?: string | null;
    expiresAt?: Date;
  };
}

export interface ICompany extends CompanyInput, mongoose.Document {
  createdAt: Date;
  updatedAt: Date;
}

const companySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    active: {
      type: Boolean,
      default: true,
    },
    lwa: {
      clientId: {
        type: String,
      },
      clientSecret: {
        type: String,
      },
      refreshToken: {
        type: String,
      },
      accessToken: {
        type: String,
      },
      expiresAt: {
        type: Date,
      },
    },
    ads: {
      redirectUri: {
        type: String,
      },
      clientId: {
        type: String,
      },
      clientSecret: {
        type: String,
      },
      refreshToken: {
        type: String,
      },
      accessToken: {
        type: String,
      },
      expiresAt: {
        type: Date,
      },
    },
  },
  {
    timestamps: true,
  }
);

const CompanyModel = mongoose.model<ICompany>("Company", companySchema);

export default CompanyModel;
