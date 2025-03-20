/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import CompanyModel from "@/models/company.model";
import { refreshAcessToken } from "@/services/amz-auth.service";
import { getCompanies } from "@/services/company.service";
import logger from "@repo/logger";

async function hourlyRefreshAccessToken() {
  logger.info("Refreshing Access Token...");
  try {
    const companies = await getCompanies();

    const tokens = await Promise.all(
      companies.map(async (company) => {
        // Call the refresh token API
        let LWAAccessToken = null;
        let ADSAccessToken = null;

        if (
          company.lwa.refreshToken &&
          company.lwa.clientId &&
          company.lwa.clientSecret
        ) {
          LWAAccessToken = await refreshAcessToken(company.lwa);
        }

        if (
          company.ads.refreshToken &&
          company.ads.clientId &&
          company.ads.clientSecret
        ) {
          ADSAccessToken = await refreshAcessToken(company.ads);
        }

        return {
          companyId: company.id,
          LWAAccessToken,
          ADSAccessToken,
        };
      })
    );

    const operations = tokens.map((token) => ({
      updateOne: {
        filter: { _id: token.companyId },
        update: {
          $set: {
            "lwa.accessToken": token.LWAAccessToken,
            "ads.accessToken": token.ADSAccessToken,
          },
        },
      },
    }));

    const result = await CompanyModel.bulkWrite(operations);

    logger.info(result, "Refreshing Access Token successfully...");
  } catch (error) {
    logger.error(error, "Error Refreshing Access Token:");
  }
}

export default hourlyRefreshAccessToken;
