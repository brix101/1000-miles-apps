import { ClusterEntity } from "@/schema/cluster.schema";

function useGetClusterFilter(data?: ClusterEntity) {
  const categoryFilterQuery = data?.categories
    .map((category) => `scraper_categories.name:"${category}"`)
    .join(" OR ");

  const customerFilterQuery = data?.customers
    .map((category) => `customer_name:"${category}"`)
    .join(" OR ");

  const tagsFilterQuery = data?.tags
    .map((category) => `tags:"${category}"`)
    .join(" OR ");

  const joinedFilter = [];

  if (categoryFilterQuery) {
    joinedFilter.push(`(${categoryFilterQuery})`);
  }

  if (customerFilterQuery) {
    joinedFilter.push(`(${customerFilterQuery})`);
  }

  if (tagsFilterQuery) {
    joinedFilter.push(`(${tagsFilterQuery})`);
  }

  const combinedFilterQuery = joinedFilter.join(" AND ");

  return combinedFilterQuery;
}

export default useGetClusterFilter;
