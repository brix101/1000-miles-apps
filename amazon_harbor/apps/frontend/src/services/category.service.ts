import { QUERY_CATEGORIES_KEY } from "@/contant/query.contant";
import api from "@/lib/api";
import { CategorySale } from "@/types/category";

export async function fetchCategories() {
  const res = await api.get<{
    items: CategorySale[];
  }>("/categories/summaries");

  return res.data.items;
}

export const getCategoriesQuery = () => ({
  queryKey: [QUERY_CATEGORIES_KEY],
  queryFn: fetchCategories,
});
