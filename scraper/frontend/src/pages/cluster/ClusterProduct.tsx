import ProductsContainer from "@/components/container/ProductsContainer";
import useGetClusterFilter from "@/hooks/useGetClusterFilter";
import { useQueryCluster } from "@/services/cluster.service";
import { useQueryFacetBatchSearch } from "@/services/facets.service";
import { useParams } from "react-router-dom";

function ClusterProduct() {
  const { clusterId } = useParams();
  const { data, isLoading } = useQueryCluster(clusterId ?? "");
  const queryFilter = useGetClusterFilter(data);

  const {
    data: algoliaData,
    isLoading: isAlgoliaDataLoading,
    isFetching,
  } = useQueryFacetBatchSearch({
    clusterId: data?.id ?? "",
    filters: queryFilter,
  });

  return (
    <>
      <div className="g-2 mb-4">
        <div className="col-auto">
          <h3 className="mb-0 d-flex align-items-center">
            {isLoading ? (
              <span
                className="spinner-border spinner-border-sm"
                style={{ height: 16, width: 16 }}
              ></span>
            ) : (
              <>
                {data?.name}.
                {isAlgoliaDataLoading || isFetching ? (
                  <span
                    className="spinner-border spinner-border-sm"
                    style={{ height: 14, width: 14 }}
                  ></span>
                ) : (
                  <>( {algoliaData?.length ?? 0} Products)</>
                )}
              </>
            )}
          </h3>
        </div>
      </div>
      <ProductsContainer />
    </>
  );
}

export default ClusterProduct;
