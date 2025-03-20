import { getUsersQuery } from "@/services/user.service";
import { User } from "@repo/schema";
import {
  UseQueryOptions,
  UseQueryResult,
  useQuery,
} from "@tanstack/react-query";
import { AxiosError } from "axios";

function useGetUsers(
  options?: UseQueryOptions<User[], AxiosError>
): UseQueryResult<User[], AxiosError> {
  return useQuery({
    ...getUsersQuery(),
    ...options,
  });
}

export default useGetUsers;
