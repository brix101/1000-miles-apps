import { QUERY_ACTIVE_USER_KEY } from "@/contant/query.contant";
import { signInMutation } from "@/services/auth.service";
import { SignInDTO, activeUserSchema } from "@repo/schema";
import {
  UseMutationResult,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { AxiosError, AxiosResponse } from "axios";
import { UseFormReturn } from "react-hook-form";
import useBoundStore from "../useBoundStore";

function useSignInUser(
  form: UseFormReturn<SignInDTO>
): UseMutationResult<AxiosResponse, AxiosError, SignInDTO, unknown> {
  const queryClient = useQueryClient();
  const { setAuthUser } = useBoundStore();

  return useMutation({
    mutationFn: signInMutation,
    onSuccess: (response) => {
      const { user, accessToken } = activeUserSchema.parse(response.data);
      setAuthUser({ user, accessToken });
      queryClient.setQueryData([QUERY_ACTIVE_USER_KEY], user);
    },
    onError: (error: AxiosError) => {
      const data = error.response?.data as any;
      form.setError("email", data, { shouldFocus: true });
      form.setError("password", { message: "" });
    },
  });
}

export default useSignInUser;
