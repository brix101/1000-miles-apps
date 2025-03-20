import { QUERY_PRODUCT_KEY } from "@/contant/query.contant";
import { ProductData, updateProduct } from "@/services/product.service";
import {
  UseMutationResult,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { AxiosError, AxiosResponse } from "axios";
import { toast } from "sonner";

const useProductEditMutation = (): UseMutationResult<
  AxiosResponse<any, any>,
  AxiosError<unknown, any>,
  {
    asin: string;
    data: ProductData;
  },
  unknown
> => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: [QUERY_PRODUCT_KEY],
    mutationFn: updateProduct,
    onSuccess: (response) => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_PRODUCT_KEY, response.data.asin],
      });
    },
    onError: (error: AxiosError) => {
      toast.error(error.message);
    },
  });
};

export default useProductEditMutation;
