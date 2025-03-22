import { QUERY_PERMISSIONS_KEY } from "@/constant/query.constant";
import {
  PermissionsEntity,
  permissionsSchema,
} from "@/schema/permission.schema";
import { v1ApiClient } from "@/utils/httpCommon";
import { UseQueryOptions, useQuery } from "@tanstack/react-query";
import { AxiosError } from "axios";

export const useQueryPermissions = (
  options?: UseQueryOptions<
    PermissionsEntity,
    AxiosError,
    PermissionsEntity,
    readonly [string]
  >
) => {
  return useQuery({
    queryKey: [QUERY_PERMISSIONS_KEY],
    queryFn: async function () {
      const res = await v1ApiClient.get("/permissions");
      return permissionsSchema.parse({ permissions: res.data });
    },
    ...options,
  });
};
