import { ProductData, getProductQuery } from "@/services/product.service";
import { UseQueryResult, useQuery } from "@tanstack/react-query";

function useGetProduct(asin: string): UseQueryResult<
  | (ProductData & {
      sellerSku: string;
      asin: string;
    })
  | null,
  Error
> {
  return useQuery({
    ...getProductQuery(asin),
    enabled: asin !== "",
  });
}

export default useGetProduct;
