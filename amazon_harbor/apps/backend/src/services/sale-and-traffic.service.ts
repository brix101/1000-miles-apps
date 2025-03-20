import type { SaleAndTrafficInput } from "@/models/sale-and-traffic.model";
import SaleAndTrafficModel from "@/models/sale-and-traffic.model";
import type { MongooseError } from "mongoose";
import { parseSalesTrafficReport } from "./amz-report-sales.service";
import {
  createReport,
  getReportDocument,
  getReportDocumentId,
} from "./amz-report-sp.service";
import { getCompaniesToken } from "./company.service";

interface GetSaleAndTraffic {
  marketplaceId: string;
  dataStartTime: string;
  dataEndTime: string;
}

/**
 * Retrieves sales and traffic data for a given marketplace within a specified time range.
 * If the data is already available in the database, it is retrieved directly.
 * Otherwise, a new sales and traffic report is generated, parsed, and upserted into the database.
 * @param input - An object containing input parameters:
 *              - marketplaceId: The ID of the marketplace for which sales and traffic data is to be retrieved.
 *              - dataStartTime: The start time of the data range for which sales and traffic data is to be retrieved.
 *              - dataEndTime: The end time of the data range for which sales and traffic data is to be retrieved.
 * @returns The sales and traffic data for the specified marketplace within the specified time range.
 */
export async function getSaleAndTraffic(input: GetSaleAndTraffic) {
  const { marketplaceId, dataStartTime, dataEndTime } = input;

  const key = JSON.stringify({
    marketplaceIds: [marketplaceId],
    dataStartTime,
    dataEndTime,
  });

  const SAT = await SaleAndTrafficModel.findOne({
    key,
  });

  if (SAT) {
    return SAT;
  }

  const newSAT = await createSaleAndTraffic(input);
  return newSAT;
}

/**
 * Creates or updates sales and traffic data for a given marketplace within a specified time range.
 * This function generates a sales and traffic report, parses the report data, and upserts the data
 * into the database.
 * @param input - An object containing input parameters:
 *              - marketplaceId: The ID of the marketplace for which sales and traffic data is to be retrieved.
 *              - dataStartTime: The start time of the data range for which sales and traffic data is to be retrieved.
 *              - dataEndTime: The end time of the data range for which sales and traffic data is to be retrieved.
 * @returns The result of the upsert operation containing the sales and traffic data.
 */
export async function createSaleAndTraffic(input: GetSaleAndTraffic) {
  const { marketplaceId, dataStartTime, dataEndTime } = input;

  const key = { marketplaceIds: [marketplaceId], dataStartTime, dataEndTime };

  const companies = await getCompaniesToken();

  const reports = await Promise.all(
    companies.map(async (company) => {
      const createReportResponse = await createReport(company, {
        reportType: "GET_SALES_AND_TRAFFIC_REPORT",
        reportOptions: {
          dateGranularity: "DAY",
          asinGranularity: "SKU",
        },
        ...key,
      });

      const accessToken = company.lwa.accessToken || "";
      const reportData = await getReportDocumentId(
        accessToken,
        createReportResponse
      );
      const reportDocument = await getReportDocument(accessToken, reportData);

      const report = await parseSalesTrafficReport(reportDocument);

      return report;
    })
  );

  const report = reports.reduce((acc, curr) => {
    acc.salesAndTrafficByAsin = acc.salesAndTrafficByAsin.concat(
      curr.salesAndTrafficByAsin
    );
    acc.salesAndTrafficByDate = acc.salesAndTrafficByDate.concat(
      curr.salesAndTrafficByDate
    );
    return acc;
  });

  const saleAndTraffic = await upsertSaleAndTraffic({
    key: JSON.stringify(key),
    ...report,
  });

  return saleAndTraffic;
}

/**
 * Upserts a SaleAndTraffic document in the database.
 * If a document with the same date and marketplaceId exists, it updates the existing document.
 * If no matching document is found, it inserts a new document.
 * @param input - The input data for upserting the SaleAndTraffic document.
 * @returns A Promise that resolves to the upserted SaleAndTraffic document.
 * @throws MongooseError if an error occurs during the upsert process.
 */
export async function upsertSaleAndTraffic(input: SaleAndTrafficInput) {
  try {
    return SaleAndTrafficModel.findOneAndUpdate(
      { key: input.key },
      {
        $set: {
          reportSpecification: input.reportSpecification,
          salesAndTrafficByAsin: input.salesAndTrafficByAsin,
          salesAndTrafficByDate: input.salesAndTrafficByDate,
        },
      },
      { upsert: true, new: true }
    );
  } catch (e) {
    throw e as MongooseError;
  }
}
