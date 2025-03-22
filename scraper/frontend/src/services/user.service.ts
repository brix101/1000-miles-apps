import { QUERY_USERS_KEY, QUERY_USER_KEY } from "@/constant/query.constant";
import {
  CreateUserInput,
  UpdateUserInput,
  UserEntity,
  UsersEntity,
  userSchema,
  usersSchema,
} from "@/schema/user.schema";
import { useBoundStore } from "@/store";
import formDataConverter from "@/utils/formDataConverter";
import { v1ApiClient } from "@/utils/httpCommon";
import { UseQueryOptions, useQuery } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { filterInput } from "../hooks/filterInput";

const {
  auth: { accessToken, user },
  setAuthUser,
} = useBoundStore.getState();

export async function fetchCurrentUser() {
  if (accessToken && !user) {
    const res = await v1ApiClient.get("/auth/me");
    const parsedUser = userSchema.parse(res.data);
    setAuthUser(parsedUser);
    return parsedUser;
  }

  return null;
}

export const useQueryUsers = (
  options?: UseQueryOptions<
    UsersEntity,
    AxiosError,
    UsersEntity,
    readonly [string]
  >
) => {
  return useQuery({
    queryKey: [QUERY_USERS_KEY],
    queryFn: async function () {
      const res = await v1ApiClient.get("/users");
      return usersSchema.parse({ users: res.data });
    },
    ...options,
  });
};

export const useQueryUser = (userId: string) => {
  const getUser = async (userId: string) => {
    const res = await v1ApiClient.get(`/users/${userId}`);
    return userSchema.parse(res.data);
  };
  return useQuery<UserEntity>([QUERY_USER_KEY, userId], () => getUser(userId));
};

export function createUserMutation(values: CreateUserInput) {
  const form = formDataConverter(values);
  return v1ApiClient.post("/users/", form, {
    headers: {
      Accept: "application/json",
      "Content-Type": "multipart/form-data",
    },
  });
}

export function updateUserMutation({ id, ...body }: UpdateUserInput) {
  const filteredBody = filterInput(body);
  const form = formDataConverter(filteredBody);
  return v1ApiClient.put(`/users/${id}`, form, {
    headers: {
      Accept: "application/json",
      "Content-Type": "multipart/form-data",
    },
  });
}

export function deleteUserMutation(id: string) {
  return v1ApiClient.delete(`/users/${id}`, {
    headers: {
      Accept: "application/json",
    },
  });
}

export function deleteUsersMutation(ids: Array<string>) {
  return v1ApiClient.delete("/users/", {
    headers: {
      Accept: "application/json",
    },
    data: {
      ids,
    },
  });
}
