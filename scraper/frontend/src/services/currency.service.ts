import { QUERY_CURRENCIES_KEY } from "@/constant/query.constant";
import { CurrenciesEntity, currenciesSchema } from "@/schema/currency.schema";
import { v1ApiClient } from "@/utils/httpCommon";
import { UseQueryOptions, useQuery } from "@tanstack/react-query";
import { AxiosError } from "axios";

export const useQueryCurrencies = (
  options?: UseQueryOptions<
    CurrenciesEntity,
    AxiosError,
    CurrenciesEntity,
    readonly [string]
  >
) => {
  return useQuery({
    queryKey: [QUERY_CURRENCIES_KEY],
    queryFn: async function () {
      const res = await v1ApiClient.get("/currencies");
      return currenciesSchema.parse({ currencies: res.data });
    },
    ...options,
  });
};
