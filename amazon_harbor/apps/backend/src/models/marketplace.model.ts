import mongoose from "mongoose";

export interface MarketplaceInput {
  marketplaceId: string;
  countryCode: string;
  name: string;
  defaultCurrencyCode: string;
  defaultLanguageCode: string;
  domainName: string;
  sellersAccounts: string[];
}

export interface IMarketplace extends MarketplaceInput, mongoose.Document {
  createdAt: Date;
  updatedAt: Date;
}

const marketplaceSchema = new mongoose.Schema(
  {
    marketplaceId: { type: String },
    countryCode: { type: String },
    country: { type: String },
    name: { type: String },
    defaultCurrencyCode: { type: String },
    defaultLanguageCode: { type: String },
    domainName: { type: String },
    sellersAccounts: [{ type: String }],
  },
  {
    timestamps: true,
  }
);

const MarketplaceModel = mongoose.model<IMarketplace>(
  "Marketplace",
  marketplaceSchema
);

export default MarketplaceModel;
