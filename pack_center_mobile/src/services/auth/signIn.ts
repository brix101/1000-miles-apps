import { api } from "@/lib/axios-client";
import { MutationConfig } from "@/lib/react-query";
import { SignInDTO } from "@/schema/auth";
import { UserResource } from "@/schema/user";
import { useMutation } from "@tanstack/react-query";

export const signInMutation = (data: SignInDTO) => {
  return api.post<{ user: UserResource }>("/auth/sign-in", data);
};

type MutationFnType = typeof signInMutation;

export function useSignInUser(options?: MutationConfig<MutationFnType>) {
  return useMutation({
    ...options,
    mutationFn: signInMutation,
  });
}
