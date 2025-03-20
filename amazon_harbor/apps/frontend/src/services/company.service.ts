import { QUERY_COMPANIES_KEY } from "@/contant/query.contant";
import api from "@/lib/api";
import { Company } from "@repo/schema";

export async function fetchCompanies() {
  const res = await api.get<{ data: Company[] }>("/companies");

  return res.data.data;
}

export const getCompaniesQuery = () => ({
  queryKey: [QUERY_COMPANIES_KEY],
  queryFn: fetchCompanies,
});
