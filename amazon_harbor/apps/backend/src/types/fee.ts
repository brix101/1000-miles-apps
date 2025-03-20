import type { MoneyType } from "@repo/schema";

export interface FeeDetail {
  FeeType: string;
  FeeAmount: MoneyType;
  FinalFee: MoneyType;
  FeePromotion: MoneyType;
}

export interface FeesEstimate {
  TimeOfFeesEstimation: string;
  TotalFeesEstimate: MoneyType;
  FeeDetailList: FeeDetail[];
}

export interface PriceToEstimateFees {
  ListingPrice: MoneyType;
  Shipping: MoneyType;
  Points: {
    PointsNumber: number;
    PointsMonetaryValue: MoneyType;
  };
}

export interface FeesEstimateIdentifier {
  MarketplaceId: string;
  IdType: string;
  SellerId: string;
  SellerInputIdentifier: string;
  IsAmazonFulfilled: boolean;
  IdValue: string;
  PriceToEstimateFees: PriceToEstimateFees;
}

export interface FeesEstimateResult {
  Status: string;
  FeesEstimateIdentifier: FeesEstimateIdentifier;
  FeesEstimate: FeesEstimate;
}

export interface GetMyFeesEstimateResult {
  FeesEstimateResult: FeesEstimateResult;
}
