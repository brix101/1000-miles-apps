import ProductModel from "@/models/product.model";
import { parseListingDocument } from "@/services/amz-report-listing.service";
import {
  createReport,
  getReportDocument,
  getReportDocumentId,
} from "@/services/amz-report-sp.service";
import { getCompaniesToken } from "@/services/company.service";
import logger from "@repo/logger";

async function dailyListingUpdateJob() {
  // Log the initialization of the daily listings report cron job
  logger.info("Initializing daily Listings update cron job...");
  try {
    const companies = await getCompaniesToken();

    const companyOperations = await Promise.all(
      companies.map(async (company) => {
        try {
          const accessToken = company.lwa.accessToken || "";
          const createReportResponse = await createReport(company, {
            reportType: "GET_MERCHANT_LISTINGS_ALL_DATA",
          });

          const reportData = await getReportDocumentId(
            accessToken,
            createReportResponse
          );

          const reportDocument = await getReportDocument(
            accessToken,
            reportData
          );

          const listings = await parseListingDocument(reportDocument);

          const operations = listings.map((listing) => ({
            updateOne: {
              filter: { asin: listing.asin }, // Filter to find the document
              update: {
                $set: {
                  sellerSku: listing.sellerSku,
                  status: listing.status,
                  company: company._id,
                },
              }, // Update operation
              upsert: true, // Upsert option to insert if not found
            },
          }));

          return operations;
        } catch (error) {
          logger.error(error, `Error processing company ${company.id}`);
          return []; // Return an empty array if an error occurs
        }
      })
    );

    const savedListings = await ProductModel.bulkWrite(
      companyOperations.flat()
    );

    logger.info(
      savedListings,
      "Daily Listings update job executed successfully."
    );
  } catch (error) {
    logger.error(error, "Error executing daily update job");
  }
}

export default dailyListingUpdateJob;
