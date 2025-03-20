export interface ADProfile {
  profileId: number;
  countryCode: string;
  currencyCode: string;
  dailyBudget: number;
  timezone: string;
  accountInfo: {
    marketplaceStringId: string;
    id: string;
    type: string;
    name: string;
    validPaymentMethod: boolean;
  };
}

export interface AdSponsoredProduct {
  roasClicks14d: number | null;
  cost: number;
  costPerClick: number | null;
  endDate: string;
  acosClicks7d: number | null;
  campaignId: number;
  sales1d: number;
  impressions: number;
  acosClicks14d: number | null;
  campaignBudgetCurrencyCode: string;
  spend: number;
  campaignBudgetType: string;
  campaignStatus: string;
  advertisedSku: string;
  advertisedAsin: string;
  clicks: number;
  campaignName: string;
  campaignBudgetAmount: number;
  startDate: string;
  roasClicks7d: number | null;
  unitsSoldClicks1d: number;
  unitsSoldClicks7d: number;
  unitsSoldClicks30d: number;
  portfolio: string;
  portfolioId: string;
}

export interface Portfolio {
  inBudget: boolean;
  portfolioId: string;
  name: string;
  state: string;
}
