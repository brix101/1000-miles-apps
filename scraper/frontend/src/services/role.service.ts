import { QUERY_ROLES_KEY } from "@/constant/query.constant";
import { RolesEntity, rolesSchema } from "@/schema/role.schema";
import { v1ApiClient } from "@/utils/httpCommon";
import { UseQueryOptions, useQuery } from "@tanstack/react-query";
import { AxiosError } from "axios";

export const useQueryRoles = (
  options?: UseQueryOptions<
    RolesEntity,
    AxiosError,
    RolesEntity,
    readonly [string]
  >
) => {
  return useQuery({
    queryKey: [QUERY_ROLES_KEY],
    queryFn: async function () {
      const res = await v1ApiClient.get("/roles");
      return rolesSchema.parse({ roles: res.data });
    },
    ...options,
  });
};
