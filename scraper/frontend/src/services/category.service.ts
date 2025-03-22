import {
  QUERY_CATEGORIES_KEY,
  QUERY_NESTED_CATEGORIES_KEY,
} from "@/constant/query.constant";
import {
  AddCategoryInput,
  NestedCategoriesEntity,
  PaginatedCategories,
  RemoveChildCategoryInput,
  UpdateCategoryInput,
  nestedCategoriesSchema,
  paginatedCategoriesSchema,
} from "@/schema/category.schema";
import { v1ApiClient } from "@/utils/httpCommon";
import {
  UseInfiniteQueryOptions,
  UseQueryOptions,
  useInfiniteQuery,
  useQuery,
} from "@tanstack/react-query";
import { AxiosError, AxiosResponse } from "axios";

export const useQueryNestedCategories = (
  options?: UseQueryOptions<
    NestedCategoriesEntity,
    AxiosError,
    NestedCategoriesEntity,
    readonly [string]
  >
) => {
  return useQuery({
    queryKey: [QUERY_NESTED_CATEGORIES_KEY],
    queryFn: async function () {
      const res = await v1ApiClient.get("/categories");
      return nestedCategoriesSchema.parse({ categories: res.data });
    },
    ...options,
  });
};

export const useQueryPaginatedCategories = (
  page?: number,
  perPage?: number,
  category?: string,
  options?: UseQueryOptions<PaginatedCategories, AxiosError>
) => {
  return useQuery<PaginatedCategories, AxiosError>(
    [QUERY_NESTED_CATEGORIES_KEY, page, perPage, category],
    async () => {
      const params = {
        page,
        per_page: perPage,
        category,
      };

      const res = await v1ApiClient.get("/categories?paginate=true", {
        params,
      });

      return paginatedCategoriesSchema.parse({ ...res.data });
    },
    options
  );
};

export const useInfiniteQueryPaginatedCategories = (
  perPage?: number,
  category?: string,
  options?: UseInfiniteQueryOptions<
    AxiosResponse<PaginatedCategories>,
    AxiosError
  >
) => {
  return useInfiniteQuery<AxiosResponse<PaginatedCategories>, AxiosError>(
    [QUERY_CATEGORIES_KEY, perPage, category],
    async ({ pageParam = 1 }) => {
      const params = {
        page: pageParam,
        per_page: perPage,
        category,
      };
      const res = await v1ApiClient.get("/categories?paginate=true", {
        params,
      });
      const data = paginatedCategoriesSchema.parse(res.data);
      return { ...res, data };
    },
    {
      getNextPageParam: (lastPage) => {
        const total_pages = lastPage.data.total_pages ?? 0;
        const page = lastPage.data.page ?? 1;

        if (total_pages > page) {
          return page + 1;
        }
        return null;
      },
      ...options,
    }
  );
};

export function addCategoryMutation({ category }: AddCategoryInput) {
  return v1ApiClient.post("/categories", JSON.stringify({ category }), {
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
  });
}

export function updateCategoryMutation({ id, category }: UpdateCategoryInput) {
  return v1ApiClient.put(`/categories/${id}`, JSON.stringify({ category }), {
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
  });
}

export function removeCategoryMutation(id: string) {
  return v1ApiClient.delete(`/categories/${id}`, {
    headers: {
      Accept: "application/json",
    },
  });
}

export function addChildCategoryMutation({
  id,
  category,
}: UpdateCategoryInput) {
  return v1ApiClient.post(
    `/categories/${id}/sub`,
    JSON.stringify({ category }),
    {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    }
  );
}

export function removeChildCategoryMutation({
  id,
  sub_ids,
}: RemoveChildCategoryInput) {
  return v1ApiClient.delete(`/categories/${id}/sub`, {
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    data: {
      sub_ids,
    },
  });
}
