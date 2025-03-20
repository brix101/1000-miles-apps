import { QUERY_MARKETPLACES_KEY } from "@/contant/query.contant";
import api from "@/lib/api";
import { MarkerplacesExtendEntryDTO } from "@repo/schema";

export async function fetchMarketplaceParticipations() {
  const res = await api.get<MarkerplacesExtendEntryDTO>(
    "/marketplaces/participations"
  );

  return res.data.items;
}

export const getMarketplaceParticipationsQuery = () => ({
  queryKey: [QUERY_MARKETPLACES_KEY, "participations"],
  queryFn: fetchMarketplaceParticipations,
});

export async function fetchMarketplace() {
  const res = await api.get<MarkerplacesExtendEntryDTO>("/marketplaces");

  return res.data.items;
}

export const getMarketplaceQuery = () => ({
  queryKey: [QUERY_MARKETPLACES_KEY],
  queryFn: fetchMarketplace,
});
