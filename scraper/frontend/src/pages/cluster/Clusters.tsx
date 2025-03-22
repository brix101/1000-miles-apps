import TableLoader from "@/components/loader/TableLoader";
import ClusterCreateModal from "@/components/modals/ClusterCreateModal";
import ClusterDeactivateModal from "@/components/modals/ClusterDeactivateModal";
import ClusterEditModal from "@/components/modals/ClusterEditModal";
import ClusterTable from "@/components/tables/ClusterTable";
import { useQueryClusters } from "@/services/cluster.service";

function Clusters() {
  const { data, isLoading } = useQueryClusters();

  return (
    <>
      <div className="g-2 mb-4">
        <div className="col-auto">
          <h3 className="mb-0">Clusters</h3>
        </div>
      </div>
      {isLoading ? <TableLoader /> : <ClusterTable data={data} />}
      <ClusterCreateModal />
      <ClusterDeactivateModal />
      <ClusterEditModal />
    </>
  );
}

export default Clusters;
