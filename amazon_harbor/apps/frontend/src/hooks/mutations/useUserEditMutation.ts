import { QUERY_USERS_KEY } from "@/contant/query.contant";
import { updateUser } from "@/services/user.service";
import { UpdateUserDTO, User } from "@repo/schema";
import {
  UseMutationResult,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { AxiosError, AxiosResponse } from "axios";
import { UseFormReturn } from "react-hook-form";
import { toast } from "sonner";

function useUserEditMutation(
  form: UseFormReturn<UpdateUserDTO>
): UseMutationResult<
  AxiosResponse<User, any>,
  AxiosError,
  {
    id: string;
    data: UpdateUserDTO;
  },
  unknown
> {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: [QUERY_USERS_KEY],
    mutationFn: updateUser,
    onSuccess: (response) => {
      toast.success("User has been updated!");
      queryClient.invalidateQueries({ queryKey: [QUERY_USERS_KEY] });
    },
    onSettled: (response) => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_USERS_KEY, response?.data._id],
      });
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

export default useUserEditMutation;
