import { QUERY_RETURN_KEY } from "@/contant/query.contant";
import api from "@/lib/api";
import { createObjectParams } from "@/lib/utils";
import { ReturnDataResult } from "@/types/return";
import { ISalesOrderMetricQuery } from "./sale.service";

export async function fetchReturn(query: ISalesOrderMetricQuery) {
  const params = createObjectParams(query);

  const res = await api.get<ReturnDataResult>("/returns/metrics", {
    params,
  });

  return res.data;
}

export const getReturnQuery = (query: ISalesOrderMetricQuery) => ({
  queryKey: [QUERY_RETURN_KEY, query],
  queryFn: async () => fetchReturn(query),
});
