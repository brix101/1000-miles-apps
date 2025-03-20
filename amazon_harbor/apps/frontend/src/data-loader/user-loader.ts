import { getUserQuery, getUsersQuery } from "@/services/user.service";
import { LoaderType } from "@/types";
import { User } from "@repo/schema";
import { LoaderFunctionArgs } from "react-router-dom";

export const usersLoader =
  ({ queryClient }: LoaderType) =>
  async () => {
    const query = getUsersQuery();
    return (
      queryClient.getQueryData<User[]>(query.queryKey) ??
      (await queryClient.fetchQuery(query))
    );
  };

const userLoader =
  ({ queryClient }: LoaderType) =>
  async ({ params }: LoaderFunctionArgs) => {
    const id = params.id ?? "";
    const query = getUserQuery(id);

    const user =
      queryClient.getQueryData<User>(query.queryKey) ??
      (await queryClient.fetchQuery(query));
    return user;
  };

export default userLoader;
