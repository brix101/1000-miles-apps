import axios from "axios";
import zlib from "zlib";

import type { ReportDocument } from "@/types/report";
import type { SalesAndTrafficReport } from "@/types/sales";

export async function parseSalesTrafficReport(reportDocument: ReportDocument) {
  const { url } = reportDocument;

  const reportData = await axios.get<ArrayBuffer>(url, {
    responseType: "arraybuffer",
  });

  const decompressedData = zlib.gunzipSync(reportData.data).toString("utf8");
  const items = JSON.parse(decompressedData) as SalesAndTrafficReport;

  return items;
}
