import {
  QUERY_CLUSTERS_KEY,
  QUERY_CLUSTER_KEY,
} from "@/constant/query.constant";
import {
  ClusterEntity,
  ClustersEntity,
  CreateClusterInput,
  UpdateClusterInput,
  clusterSchema,
  clustersSchema,
} from "@/schema/cluster.schema";
import { v1ApiClient } from "@/utils/httpCommon";
import { UseQueryOptions, useQuery } from "@tanstack/react-query";
import { AxiosError } from "axios";

export const useQueryClusters = (
  options?: UseQueryOptions<
    ClustersEntity,
    AxiosError,
    ClustersEntity,
    readonly [string]
  >
) => {
  return useQuery({
    queryKey: [QUERY_CLUSTERS_KEY],
    queryFn: async function () {
      const res = await v1ApiClient.get("/clusters");
      return clustersSchema.parse({ clusters: res.data });
    },
    ...options,
  });
};

export const useQueryCluster = (clusterId: string) => {
  const getCluster = async (clusterId: string) => {
    const res = await v1ApiClient.get(`/clusters/${clusterId}`);
    return clusterSchema.parse(res.data);
  };
  return useQuery<ClusterEntity>([QUERY_CLUSTER_KEY, clusterId], () =>
    getCluster(clusterId)
  );
};

export const createClusterMutation = (input: CreateClusterInput) => {
  return v1ApiClient.post("/clusters/", JSON.stringify(input), {
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
  });
};

export const updateClusterMutation = ({ id, ...input }: UpdateClusterInput) => {
  return v1ApiClient.put(`/clusters/${id}`, JSON.stringify(input), {
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
  });
};

export function deleteClusterMutation(id: string) {
  return v1ApiClient.delete(`/clusters/${id}`, {
    headers: {
      Accept: "application/json",
    },
  });
}
