import { useQueryCluster } from "@/services/cluster.service";
import { NavLink, useParams } from "react-router-dom";

function Cluster() {
  const { clusterId } = useParams();

  const { data } = useQueryCluster(clusterId ?? "");

  return (
    <div className="mx-n4 mx-lg-n6 px-lg-6 position-relative">
      <nav className="mb-2" aria-label="breadcrumb">
        <ol className="breadcrumb mb-0">
          <li className="breadcrumb-item">
            <NavLink
              to="/dashboard/clusters"
              end
              className={({ isActive, isPending }) => {
                return isActive ? "active" : isPending ? "pending" : "";
              }}
            >
              All Clusters
            </NavLink>
          </li>
          <li className="breadcrumb-item active">{data?.name}</li>
        </ol>
      </nav>

      <div className="g-2 mb-4">
        <div className="col-auto">
          <h3 className="mb-0">{data?.name}</h3>
        </div>
      </div>
    </div>
  );
}

export default Cluster;
