import { QUERY_ZULU_PRODUCTS_KEY } from "@/contant/query.contant";
// import zuluApi from "@/lib/zulu-api";
// import { ZuluAssortment } from "@/types/zulu-assortment";

export async function fetchZuluAssortment(assort: string) {
  // const res = await zuluApi.get<ZuluAssortment>(
  //   `/zulu-amazon/assortments/${assort}`
  // );

  // return res.data;
  return {
    item_number: "",
    category: "",
    name: "",
    mops: [],
    stocks: [],
    id: 0,
    sub_category: "",
    amz_packaging_size: "",
  };
}

export const getZuluAssortmentQuery = (assort: string) => ({
  queryKey: [QUERY_ZULU_PRODUCTS_KEY, assort],
  queryFn: async () => fetchZuluAssortment(assort),
});
