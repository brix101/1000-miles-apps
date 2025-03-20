import EstimatedFeeModel from "@/models/estimated-fee.model";
import type { GetMyFeesEstimateResult } from "@/types/fee";
import { apiInstance } from "@/utils/api-instance";
import logger from "@repo/logger";
import { findProduct } from "./product.service";

export interface MyFeesEstimateForSKUParams {
  MarketplaceId?: string;
  SellerSKU: string;
  amount: number;
}

/**
 * Retrieves the estimated fees for a given Seller SKU from the API.
 * Caches the result to improve performance on subsequent calls.
 * @param params - Parameters for retrieving fees estimate.
 * @returns Estimated fees for the specified Seller SKU.
 */
export async function getMyFeesEstimateForSKU(
  params: MyFeesEstimateForSKUParams
) {
  try {
    const product = await findProduct(
      { sellerSku: params.SellerSKU },
      { populate: "company" }
    );

    const key = JSON.stringify(params);

    const estimatedFeeData = await EstimatedFeeModel.findOne({ key }).lean();

    if (estimatedFeeData) {
      return estimatedFeeData.totalFeesEstimate;
    }

    const accessToken = product?.company?.lwa?.accessToken || "";

    const response = await apiInstance.post<{
      payload: GetMyFeesEstimateResult;
    }>(
      `/products/fees/v0/listings/${params.SellerSKU}/feesEstimate`,
      {
        FeesEstimateRequest: {
          MarketplaceId: params.MarketplaceId || "ATVPDKIKX0DER",
          PriceToEstimateFees: {
            ListingPrice: {
              CurrencyCode: "USD",
              Amount: params.amount,
            },
            Shipping: {
              CurrencyCode: "USD",
              Amount: 0.5,
            },
            Points: {
              PointsNumber: 0,
              PointsMonetaryValue: {
                CurrencyCode: "USD",
                Amount: 0,
              },
            },
          },
          Identifier: params.SellerSKU,
        },
      },
      {
        headers: {
          "x-amz-access-token": accessToken,
        },
      }
    );

    const payload = response.data.payload;

    const result = payload.FeesEstimateResult.FeesEstimate.TotalFeesEstimate;

    await EstimatedFeeModel.create({ key, totalFeesEstimate: result });

    return result;
  } catch (error) {
    logger.error(
      error,
      `Failed to get fees estimate for SKU ${params.SellerSKU}`
    );
    return {
      Amount: 0,
      CurrencyCode: "USD",
    };
  }
}
