import { getCategoriesQuery } from "@/services/category.service";
import { CategorySale } from "@/types/category";
import {
  UseQueryOptions,
  UseQueryResult,
  useQuery,
} from "@tanstack/react-query";
import { AxiosError } from "axios";

function useGetCategories(
  options?: UseQueryOptions<CategorySale[], AxiosError>
): UseQueryResult<CategorySale[], AxiosError> {
  return useQuery({
    ...getCategoriesQuery(),
    ...options,
  });
}

export default useGetCategories;
