import { QUERY_MODULES_KEY } from "@/contant/query.contant";
import api from "@/lib/api";
import { Module } from "@repo/schema";

export async function fetchModules() {
  const res = await api.get<{ data: Module[] }>("/modules");

  return res.data.data;
}

export const getModulesQuery = () => ({
  queryKey: [QUERY_MODULES_KEY],
  queryFn: fetchModules,
});
