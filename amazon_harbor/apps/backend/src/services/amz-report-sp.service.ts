import {
  ProcessingStatus,
  type CreateReportResponse,
  type CreateReportSpecification,
  type Report,
  type ReportDocument,
} from "@/types/report";
import { apiInstance } from "@/utils/api-instance";
import logger from "@repo/logger";
import type { Company } from "@repo/schema";
import { getMarketplaces } from "./marketplace.service";

/**
 * Creates a report based on the provided report specification.
 * If marketplaceIds are not provided or if the provided array is empty,
 * it dynamically fetches marketplaceIds using getMarketplaceParticipations.
 * @param spec - The report specification containing details such as report type, marketplaceIds, etc.
 * @returns A promise that resolves to the response data of the created report, including the report ID.
 */
export async function createReport(
  company: Company,
  spec: CreateReportSpecification
) {
  if (!spec.marketplaceIds || spec.marketplaceIds.length === 0) {
    const marketplaces = await getMarketplaces({});
    spec.marketplaceIds = marketplaces.map((item) => item.marketplaceId);
  }

  const response = await apiInstance.post<CreateReportResponse>(
    "/reports/2021-06-30/reports",
    spec,
    {
      headers: {
        "x-amz-access-token": company.lwa.accessToken,
      },
    }
  );

  return response.data;
}

/**
 * Retrieves the report document associated with the provided report ID.
 * Polls the report status until the report processing is completed and the report document is available.
 * @param params - The response containing the report ID.
 * @returns A promise that resolves to the report once its processing is completed and the report document is available.
 */
export async function getReportDocumentId(
  accessToken: string,
  params: CreateReportResponse
) {
  // Define a function to fetch the reportDocumentId
  async function fetchReportDocumentId() {
    const response = await apiInstance.get<Report>(
      `/reports/2021-06-30/reports/${params.reportId}`,
      {
        headers: {
          "x-amz-access-token": accessToken,
        },
      }
    );

    logger.info(
      `Polling report ${params.reportId}: ${response.data.processingStatus}`
    );

    return response.data;
  }

  // Define a function for polling with a flexible timeout
  const pollWithTimeout = async (timeout: number): Promise<Report> => {
    const result = await fetchReportDocumentId();

    if (result.processingStatus === ProcessingStatus.DONE) {
      return result;
    }

    return new Promise<Report>((resolve) => {
      setTimeout(async () => {
        resolve(await pollWithTimeout(timeout));
      }, timeout);
    });
  };

  // Start polling with an initial timeout of 5 seconds
  return pollWithTimeout(5000);
}

/**
 * Retrieves the report document information associated with the provided report.
 * Makes a request to the API to get the report document information.
 * @param report - The report containing the report document ID.
 * @returns A promise that resolves to the report document information.
 */
export async function getReportDocument(accessToken: string, report: Report) {
  try {
    const response = await apiInstance.get<ReportDocument>(
      `/reports/2021-06-30/documents/${report.reportDocumentId}`,
      {
        headers: {
          "x-amz-access-token": accessToken,
        },
      }
    );

    logger.info(`reportDocumentId: ${response.data.reportDocumentId}`);
    return response.data;
  } catch (error) {
    logger.error(error, "Error fetching report document:");
    throw error;
  }
}
