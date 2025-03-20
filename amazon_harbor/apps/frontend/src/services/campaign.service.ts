import { QUERY_CAMPAIGNS_KEY } from "@/contant/query.contant";
import api from "@/lib/api";
import { createObjectParams } from "@/lib/utils";
import { CampaignResult } from "@/types/ads";

export interface ICampaignQuery {
  interval: string;
  status?: string;
}

export async function fetchCampaigns(query: ICampaignQuery) {
  const params = createObjectParams(query);

  const res = await api.get<CampaignResult>("/campaigns", { params });

  return res.data.items;
}

export const getCampaignsQuery = (query: ICampaignQuery) => ({
  queryKey: [QUERY_CAMPAIGNS_KEY, query],
  queryFn: async () => fetchCampaigns(query),
});
