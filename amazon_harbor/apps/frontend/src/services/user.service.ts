import { QUERY_USERS_KEY } from "@/contant/query.contant";
import api from "@/lib/api";
import {
  CreateUserDTO,
  UpdateUserDTO,
  User,
  userSchema,
  usersSchema,
} from "@repo/schema";

export async function fetchUsers() {
  const res = await api.get("/users");
  return usersSchema.parse({ users: res.data.data }).users;
}

export const getUsersQuery = () => ({
  queryKey: [QUERY_USERS_KEY],
  queryFn: fetchUsers,
});

export const getUserQuery = (id: string) => ({
  queryKey: [QUERY_USERS_KEY, id],
  queryFn: async () => {
    const res = await api.get(`/users/${id}`);
    return userSchema.parse(res.data);
  },
});

export async function createUser(data: CreateUserDTO) {
  return await api.post<User>("/users", data, {});
}

export async function updateUser({
  id,
  data,
}: {
  id: string;
  data: UpdateUserDTO;
}) {
  return await api.put<User>(`/users/${id}`, data, {});
}

export async function deleteUser(id: string) {
  const res = await api.delete(`/users/${id}`, {});

  return res;
}
