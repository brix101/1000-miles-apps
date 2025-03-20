import { QUERY_USERS_KEY } from "@/contant/query.contant";
import { createUser } from "@/services/user.service";
import { CreateUserDTO, User } from "@repo/schema";
import {
  UseMutationResult,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { AxiosError, AxiosResponse } from "axios";
import { UseFormReturn } from "react-hook-form";
import { toast } from "sonner";

function useUserAddMutation(
  form: UseFormReturn<CreateUserDTO>
): UseMutationResult<
  AxiosResponse<User, any>,
  AxiosError,
  CreateUserDTO,
  unknown
> {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createUser,
    onSuccess: () => {
      toast.success("User has been created!");
      form.reset();
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_USERS_KEY] });
    },
    onError: (error: AxiosError) => {
      if (error.response?.status === 400) {
        form.setError("email", { message: "Email already taken" });
      } else {
        console.log(error);
      }
    },
  });
}

export default useUserAddMutation;
