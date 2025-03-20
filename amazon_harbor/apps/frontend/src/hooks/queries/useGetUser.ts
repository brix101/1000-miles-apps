import { getUserQuery } from "@/services/user.service";
import { User } from "@repo/schema";
import {
  UseQueryOptions,
  UseQueryResult,
  useQuery,
} from "@tanstack/react-query";
import { AxiosError } from "axios";

function useGetUser(
  userId: string,
  options?: UseQueryOptions<User, AxiosError>
): UseQueryResult<User, AxiosError> {
  return useQuery({
    ...getUserQuery(userId),
    ...options,
  });
}

export default useGetUser;
