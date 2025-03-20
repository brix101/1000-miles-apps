import { ICampaignQuery, getCampaignsQuery } from "@/services/campaign.service";
import { AdSponsoredProduct } from "@repo/schema";
import {
  UseQueryOptions,
  UseQueryResult,
  useQuery,
} from "@tanstack/react-query";
import { AxiosError } from "axios";

function useGetCampaigns(
  query: ICampaignQuery,
  options?: UseQueryOptions<AdSponsoredProduct[], AxiosError>
): UseQueryResult<AdSponsoredProduct[], AxiosError> {
  return useQuery({
    ...getCampaignsQuery(query),
    ...options,
  });
}

export default useGetCampaigns;
