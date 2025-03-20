import type { AdSponsoredProduct } from "@repo/schema";
import mongoose from "mongoose";

export interface CampaignInput {
  interval: string;
  adSponsoredProducts: AdSponsoredProduct[];
}

export interface ICampaign extends CampaignInput, mongoose.Document {
  createdAt: Date;
  updatedAt: Date;
}

const campaignSchema = new mongoose.Schema(
  {
    interval: {
      type: String,
      required: true,
      unique: true,
    },
    adSponsoredProducts: [
      {
        roasClicks14d: { type: Number },
        cost: { type: Number },
        costPerClick: { type: Number },
        endDate: { type: String },
        acosClicks7d: { type: Number },
        campaignId: { type: Number },
        sales1d: { type: Number },
        impressions: { type: Number },
        acosClicks14d: { type: Number },
        campaignBudgetCurrencyCode: { type: String },
        spend: { type: Number },
        campaignBudgetType: { type: String },
        campaignStatus: { type: String },
        advertisedSku: { type: String },
        advertisedAsin: { type: String },
        clicks: { type: Number },
        campaignName: { type: String },
        campaignBudgetAmount: { type: Number },
        startDate: { type: String },
        roasClicks7d: { type: Number },
        unitsSoldClicks1d: { type: Number },
        unitsSoldClicks7d: { type: Number },
        unitsSoldClicks30d: { type: Number },
        portfolioId: { type: String },
        portfolio: { type: String },
      },
    ],
  },
  {
    timestamps: true,
  },
);

const CampaignModel = mongoose.model<ICampaign>("Campaign", campaignSchema);

export default CampaignModel;
