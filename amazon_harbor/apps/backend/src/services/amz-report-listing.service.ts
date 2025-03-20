import type { ReportDocument } from "@/types/report";
import axios from "axios";

export interface ListingStatus {
  sellerSku: string;
  asin: string;
  status: string;
}

/**
 * Parses the document data retrieved from the provided report document URL into a structured format representing listing entries.
 * @param reportDocument - The report document containing the URL to retrieve the document data.
 * @returns A promise that resolves to an array of listing entries parsed from the document data.
 */
export async function parseListingDocument(
  reportDocument: ReportDocument
): Promise<ListingStatus[]> {
  // Retrieve the document data from the obtained URL
  const response = await axios.get<string>(reportDocument.url);
  // Parse the document data into a structured format

  const data = response.data;
  return (
    data
      // Split the document data into lines and filter out empty lines
      .split("\n")
      .filter((line) => line.trim() !== "")
      // Skip the header line and map each line to an object representing a report entry
      .slice(1)
      .map((line) => {
        const columns: string[] = line.split("\t"); // Split the line into columns based on tab delimiter
        const sellerSku = columns[3]; // Extract seller SKU from the columns
        const asin = columns[16]; // Extract ASIN from the columns
        const status = columns[28]; // Extract status from the columns

        return { sellerSku, asin, status }; // Return an object representing a report entry
      })
      // Filter out entries with empty ASIN values
      .filter((entry) => entry.asin !== "")
  );
}
