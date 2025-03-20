import CampaignModel from "@/models/campaign.model";
import { apiADSInstance } from "@/utils/api-instance";
import logger from "@repo/logger";
import type {
  ADProfile,
  AdSponsoredProduct,
  Company,
  Portfolio,
} from "@repo/schema";
import axios from "axios";
import dayjs from "dayjs";
import zlib from "zlib";
import { getCompaniesToken } from "./company.service";

/**
 * Retrieves sponsored products advertising report data for the specified interval.
 * @param interval - The interval for which to retrieve the report data in the format "startDate--endDate".
 * @returns An array of sponsored products advertising report data.
 * @throws Error if the interval parameter has invalid date format or if an error occurs during processing.
 */
export async function getADSReport(interval: string) {
  const [startString, endString] = interval.split("--");
  const startDate = dayjs(startString).utcOffset(0);
  const endDate = dayjs(endString).utcOffset(0);

  if (!startDate.isValid() || !endDate.isValid()) {
    throw new Error("Invalid date format in interval parameter.");
  }

  const formattedStartDate = startDate.format("YYYY-MM-DD");
  const formattedEndDate = endDate.format("YYYY-MM-DD");

  const campaignInterval = `${formattedStartDate}--${formattedEndDate}`;

  const campaignData = await CampaignModel.findOne({
    interval: campaignInterval,
  }).lean();

  if (campaignData) {
    return campaignData.adSponsoredProducts;
  }

  const adsProducts = await getParsedADSReport(
    formattedStartDate,
    formattedEndDate
  );

  await CampaignModel.create({
    interval: campaignInterval,
    adSponsoredProducts: adsProducts,
  });
  return adsProducts;
}

export async function getParsedADSReport(startDate: string, endDate: string) {
  const companies = await getCompaniesToken();

  const reportPromises = companies.map(async (company) => {
    const profiles = await getProfileIDs(company);
    const profilesPromises = profiles.map(async (profile) => {
      try {
        const profileId = profile.profileId;
        const portfolios = await getPortfolios(company, { profileId });
        const reportId = await createAdvertisedReport(company, {
          profileId,
          startDate,
          endDate,
        });

        const reportUrl = await getAdvertisedReportUrl(company, {
          reportId,
          profileId,
        });
        const reportData = await axios.get<ArrayBuffer>(reportUrl, {
          responseType: "arraybuffer",
        });

        const decompressedData = zlib
          .gunzipSync(reportData.data)
          .toString("utf8");
        const records = JSON.parse(decompressedData) as AdSponsoredProduct[];

        return records.map((record) => {
          const portfolio = portfolios.find(
            (p) => p.portfolioId === record.portfolioId.toString()
          );

          return {
            ...record,
            portfolio: portfolio?.name || "",
          };
        });
      } catch (error) {
        logger.error(error, `Error processing profile: ${profile.profileId}`);
        return [];
      }
    });

    return (await Promise.all(profilesPromises)).flat();
  });

  const reports = (await Promise.all(reportPromises)).flat();

  return reports;
}

export async function getProfileIDs(company: Company) {
  const response = await apiADSInstance.get<ADProfile[]>("/v2/profiles", {
    headers: {
      Authorization: `Bearer ${company.ads.accessToken}`,
      "Amazon-Advertising-API-ClientId": company.ads.clientId,
    },
  });

  return response.data;
}

export async function getPortfolios(
  company: Company,
  { profileId }: { profileId: number }
) {
  const response = await apiADSInstance.post<{ portfolios: Portfolio[] }>(
    "/portfolios/list",
    {},
    {
      headers: {
        "Amazon-Advertising-API-Scope": profileId,
        "Content-Type": "application/json",
        Authorization: `Bearer ${company.ads.accessToken}`,
        "Amazon-Advertising-API-ClientId": company.ads.clientId,
      },
    }
  );
  return response.data.portfolios;
}

interface AdvertisedReportParams {
  profileId: number;
  startDate: string;
  endDate: string;
}
export async function createAdvertisedReport(
  company: Company,
  params: AdvertisedReportParams
) {
  const { profileId, startDate, endDate } = params;

  const response = await apiADSInstance.post<{ reportId: string }>(
    "/reporting/reports",
    {
      name: `Advertised Product - Sponsored Products ${profileId}`,
      startDate,
      endDate,
      configuration: {
        adProduct: "SPONSORED_PRODUCTS",
        groupBy: ["advertiser"],
        columns: [
          "campaignName",
          "campaignStatus",
          "startDate",
          "endDate",
          "costPerClick",
          "campaignBudgetAmount",
          "spend",
          "sales1d",
          "impressions",
          "clicks",
          "cost",
          "campaignId",
          "campaignBudgetCurrencyCode",
          "campaignBudgetType",
          "advertisedAsin",
          "advertisedSku",
          "acosClicks7d",
          "acosClicks14d",
          "roasClicks7d",
          "roasClicks14d",
          "unitsSoldClicks1d",
          "unitsSoldClicks7d",
          "unitsSoldClicks14d",
          "unitsSoldClicks30d",
          "portfolioId",
        ],
        reportTypeId: "spAdvertisedProduct",
        timeUnit: "SUMMARY",
        format: "GZIP_JSON",
      },
    },
    {
      headers: {
        "Amazon-Advertising-API-Scope": profileId,
        "Content-Type": "application/json",
        Authorization: `Bearer ${company.ads.accessToken}`,
        "Amazon-Advertising-API-ClientId": company.ads.clientId,
      },
    }
  );

  return response.data.reportId;
}

interface AdvertisedReportUrlParams {
  reportId: string;
  profileId: number;
}
export async function getAdvertisedReportUrl(
  company: Company,
  { reportId, profileId }: AdvertisedReportUrlParams
) {
  // Define a function to fetch the reportDocumentId
  async function fetchReportUrl() {
    const response = await apiADSInstance.get<{
      status: string;
      url: string | null;
    }>(`/reporting/reports/${reportId}`, {
      headers: {
        "Amazon-Advertising-API-Scope": profileId,
        "Content-Type": "application/json",
        Authorization: `Bearer ${company.ads.accessToken}`,
        "Amazon-Advertising-API-ClientId": company.ads.clientId,
      },
    });

    logger.info(`Polling report ${reportId}: ${response.data.status}`);

    return response.data.url;
  }

  // Define a function for polling with a flexible timeout
  const pollWithTimeout = async (timeout: number): Promise<string> => {
    const result = await fetchReportUrl();

    if (result) {
      return result;
    }
    return new Promise<string>((resolve) => {
      setTimeout(async () => {
        resolve(await pollWithTimeout(timeout));
      }, timeout);
    });
  };

  // Start polling with an initial timeout of 10 seconds
  return pollWithTimeout(10000);
}
