import {
  QUERY_CUSTOMERS_KEY,
  QUERY_CUSTOMER_KEY,
} from "@/constant/query.constant";
import {
  CustomerEntity,
  CustomersEntity,
  NewCustomerInput,
  UpdateCustomerInput,
  customerSchema,
  customersSchema,
} from "@/schema/customer.schema";
import formDataConverter from "@/utils/formDataConverter";
import { v1ApiClient } from "@/utils/httpCommon";
import { UseQueryOptions, useQuery } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { filterInput } from "../hooks/filterInput";

export const getCustomers = async () => {
  const res = await v1ApiClient.get("/customers");
  return customersSchema.parse({ customers: res.data });
};

export const useQueryCustomers = (
  options?: UseQueryOptions<
    CustomersEntity,
    AxiosError,
    CustomersEntity,
    readonly [string]
  >
) => {
  return useQuery({
    queryKey: [QUERY_CUSTOMERS_KEY],
    queryFn: getCustomers,
    ...options,
  });
};

export const useQueryCustomer = (customerId: string) => {
  const getCustomer = async (customerId: string) => {
    const res = await v1ApiClient.get(`/customers/${customerId}`);
    return customerSchema.parse(res.data);
  };
  return useQuery<CustomerEntity>([QUERY_CUSTOMER_KEY, customerId], () =>
    getCustomer(customerId)
  );
};

export function deleteCustomerMutation(id: string) {
  return v1ApiClient.delete(`/customers/${id}`, {
    headers: {
      Accept: "application/json",
    },
  });
}

export function createCustomerMutation(values: NewCustomerInput) {
  const { spider_code, ...rest } = filterInput(values);

  let code: File | undefined;
  if (spider_code) {
    const blob = new Blob([spider_code], { type: "text/plain" });
    code = new File([blob], "text-file.txt", { type: "text/plain" });
  }

  const form = formDataConverter({ ...rest, code });
  return v1ApiClient.post("/customers/", form, {
    headers: {
      Accept: "application/json",
      "Content-Type": "multipart/form-data",
    },
  });
}

export function updateCustomerMutation({ id, ...body }: UpdateCustomerInput) {
  const { spider_code, ...rest } = filterInput(body);

  let code: File | undefined;
  if (spider_code) {
    const blob = new Blob([spider_code], { type: "text/plain" });
    code = new File([blob], "text-file.txt", { type: "text/plain" });
  }

  const form = formDataConverter({ ...rest, code });
  return v1ApiClient.put(`/customers/${id}`, form, {
    headers: {
      Accept: "application/json",
      "Content-Type": "multipart/form-data",
    },
  });
}
