import CompanyModel, {
  type CompanyInput,
  type ICompany,
} from "@/models/company.model";
import logger from "@repo/logger";
import type {
  FilterQuery,
  MongooseError,
  QueryOptions,
  UpdateQuery,
} from "mongoose";
import { refreshAcessToken } from "./amz-auth.service";

/**
 * Retrieves all companies from the database, optionally filtered based on provided criteria.
 * @param filter - Optional. An object containing filtering criteria based on the ICompany schema.
 * @returns A Promise that resolves to an array of company documents sorted by name in ascending order.
 */
export async function getCompanies(filter: FilterQuery<ICompany> = {}) {
  return CompanyModel.find(filter)
    .collation({ locale: "en_US", strength: 1 })
    .sort({ name: 1 });
}

export async function getCompaniesToken(filter: FilterQuery<ICompany> = {}) {
  const companies = await CompanyModel.find(filter)
    .collation({ locale: "en_US", strength: 1 })
    .sort({ name: 1 });

  const tokens = await Promise.all(
    companies.map(async (company) => {
      // Call the refresh token API

      const tokenData: Record<string, string | Date> = {};

      const lwa = company.lwa;
      const ads = company.ads;

      if (lwa.refreshToken && lwa.clientId && lwa.clientSecret) {
        if (!lwa.expiresAt || new Date() >= lwa.expiresAt) {
          const response = await refreshAcessToken(lwa);

          tokenData["lwa.accessToken"] = response.access_token;
          tokenData["lwa.expiresAt"] = new Date(
            new Date().getTime() + response.expires_in * 1000
          );
        }
      }

      if (ads.refreshToken && ads.clientId && ads.clientSecret) {
        if (!ads.expiresAt || new Date() >= ads.expiresAt) {
          const response = await refreshAcessToken(ads);

          tokenData["ads.accessToken"] = response.access_token;
          tokenData["ads.expiresAt"] = new Date(
            new Date().getTime() + response.expires_in * 1000
          );
        }
      }

      if (Object.keys(tokenData).length > 0) {
        tokenData["companyId"] = company._id;
      }

      return tokenData;
    })
  );

  const operations = tokens
    .filter((token) => Object.keys(token).length)
    .map(({ companyId, ...token }) => ({
      updateOne: {
        filter: { _id: companyId as unknown as ICompany },
        update: {
          $set: token,
        },
      },
    }));

  if (operations.length > 0) {
    logger.info("Updating tokens");
    await CompanyModel.bulkWrite(operations);

    const updatedCompanies = await CompanyModel.find({
      _id: { $in: companies.map((company) => company._id) },
    });

    return updatedCompanies;
  }

  return companies;
}

export async function createCompany(input: CompanyInput) {
  try {
    return CompanyModel.create(input);
  } catch (e) {
    throw e as MongooseError;
  }
}

export async function updateCompany(
  query: FilterQuery<ICompany>,
  update: CompanyInput,
  options: QueryOptions
) {
  const company = await CompanyModel.findOne(query);

  if (!company) {
    return null;
  }

  Object.assign(company, update);

  await company.save(options);

  return company;
}

export async function deleteCompany(query: FilterQuery<ICompany>) {
  const update: UpdateQuery<ICompany> = { active: false };
  await CompanyModel.findOne(query, update);
}
