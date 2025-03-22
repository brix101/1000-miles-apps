import { QUERY_CUSTOMER_TYPES_KEY } from "@/constant/query.constant";
import {
  CustomerTypesEntity,
  customerTypesSchema,
} from "@/schema/customerType.schema";
import { v1ApiClient } from "@/utils/httpCommon";
import { UseQueryOptions, useQuery } from "@tanstack/react-query";
import { AxiosError } from "axios";

export const useQueryCustomerTypes = (
  options?: UseQueryOptions<
    CustomerTypesEntity,
    AxiosError,
    CustomerTypesEntity,
    readonly [string]
  >
) => {
  return useQuery({
    queryKey: [QUERY_CUSTOMER_TYPES_KEY],
    queryFn: async function () {
      const res = await v1ApiClient.get("/customer-type");
      return customerTypesSchema.parse({ customerTypes: res.data });
    },
    ...options,
  });
};
