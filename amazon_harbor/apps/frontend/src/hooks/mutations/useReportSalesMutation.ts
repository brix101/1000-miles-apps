import { QUERY_REPORT_KEY } from "@/contant/query.contant";
import api from "@/lib/api";
import { createObjectParams } from "@/lib/utils";
import { ISalesOrderMetricQuery } from "@/services/sale.service";
import { UseMutationResult, useMutation } from "@tanstack/react-query";

function useReportSalesMutation(): UseMutationResult<
  void,
  Error,
  ISalesOrderMetricQuery,
  unknown
> {
  return useMutation({
    mutationKey: [QUERY_REPORT_KEY, "sales"],
    mutationFn: async (query: ISalesOrderMetricQuery) => {
      const params = createObjectParams(query);

      const response = await api.get("/reports/sales", {
        responseType: "blob", // Specify the response type as a blob
        params,
      });

      const contentType = response.headers["Content-Type"] as string;
      const filename = response.headers["content-disposition"] as string;

      const blob = new Blob([response.data], {
        type: contentType as string,
      });

      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = filename; // Set the filename with the current year
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
    },
  });
}

export default useReportSalesMutation;
