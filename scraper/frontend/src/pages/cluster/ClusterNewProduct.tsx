import ProductsContainer from "@/components/container/ProductsContainer";
import useGetClusterFilter from "@/hooks/useGetClusterFilter";
import { useQueryCluster } from "@/services/cluster.service";
import { useQueryFacetBatchSearch } from "@/services/facets.service";
import { useParams } from "react-router-dom";

function ClusterNewProduct() {
  const { clusterId } = useParams();
  const { data, isLoading } = useQueryCluster(clusterId ?? "");

  const queryFilter = useGetClusterFilter(data);

  const time2WeeksAgo = Math.floor(
    (Date.now() - 14 * 24 * 60 * 60 * 1000) / 1000
  );
  const timeStampFilter = ` AND (timestamp > ${time2WeeksAgo})`;

  const filters = `${queryFilter} ${timeStampFilter}`;

  const {
    data: algoliaData,
    isLoading: isAlgoliaLoading,
    isFetching,
  } = useQueryFacetBatchSearch({
    clusterId: data?.id + "-new" ?? "",
    filters: filters,
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
                {isAlgoliaLoading || isFetching ? (
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

export default ClusterNewProduct;
