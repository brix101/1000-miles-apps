import { QUERY_ACTIVE_USER_KEY } from "@/contant/query.contant";
import useBoundStore from "@/hooks/useBoundStore";
import api from "@/lib/api";
import {
  UseMutationResult,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { AxiosResponse } from "axios";

const state = useBoundStore.getState();

export function useLogOutMutation(): UseMutationResult<
  AxiosResponse,
  Error,
  void,
  unknown
> {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => {
      return api.post("/auth/sign-out", {});
    },
    onSuccess: () => {
      queryClient.setQueryData([QUERY_ACTIVE_USER_KEY], null);
      state.resetState();
    },
  });
}
