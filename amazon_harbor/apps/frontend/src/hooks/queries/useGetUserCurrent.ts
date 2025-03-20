import { QUERY_ACTIVE_USER_KEY } from "@/contant/query.contant";
import useBoundStore from "@/hooks/useBoundStore";
import api from "@/lib/api";
import { User, userSchema } from "@repo/schema";
import { UseQueryResult, useQuery } from "@tanstack/react-query";

function useGetUserCurrent(): UseQueryResult<User | null, Error> {
  const { setAuthUser, auth } = useBoundStore();
  return useQuery({
    queryKey: [QUERY_ACTIVE_USER_KEY],
    queryFn: async () => {
      const res = await api.get("/auth/whoami");
      if (res.data) {
        const activeUser = userSchema.parse(res.data);
        setAuthUser({ accessToken: auth.accessToken, user: activeUser });
        return activeUser;
      }
      return null;
    },
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  });
}

export default useGetUserCurrent;
