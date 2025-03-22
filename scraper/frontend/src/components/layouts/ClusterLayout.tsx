import { Icons } from "@/assets/icons";
import useGetClusterFilter from "@/hooks/useGetClusterFilter";
import { useQueryCluster } from "@/services/cluster.service";
import { Configure } from "react-instantsearch-hooks-web";
import { NavLink, Outlet, useLocation, useParams } from "react-router-dom";
import { toast } from "sonner";
import ProductInstasearchContainer from "../container/ProductInstasearchContainer";
import LoadingContent from "../loader/LoadingContent";

function ClusterLayout() {
  const { clusterId, mainCategory } = useParams();
  const { pathname } = useLocation();
  const { data, isLoading, error } = useQueryCluster(clusterId ?? "");

  const queryFilter = useGetClusterFilter(data);
  if (isLoading) {
    return <LoadingContent />;
  }

  if (error) {
    toast.error("Customer not found");
  }

  const time2WeeksAgo = Math.floor(
    (Date.now() - 14 * 24 * 60 * 60 * 1000) / 1000
  );
  const timeStampFilter = pathname.includes("new-products")
    ? ` AND (timestamp > ${time2WeeksAgo})`
    : "";

  const filters = `${queryFilter} ${timeStampFilter}`;

  return (
    <ProductInstasearchContainer>
      <Configure hitsPerPage={100} filters={filters} analytics={true} />
      <header className="mx-n4 mx-lg-n6 px-lg-6 position-relative tab-header">
        <NavLink
          to={`/dashboard/clusters/${clusterId}`}
          end
          className={({ isActive }) => {
            const btnStyle = isActive ? "active" : "btn-primary";
            return `btn btn-sm rounded-0 ${btnStyle}`;
          }}
        >
          <Icons.Ucube height={16} widht={16} />
          Products
        </NavLink>
        <NavLink
          to={`/dashboard/clusters/${clusterId}/analysis`}
          className={({ isActive }) => {
            const btnStyle = isActive ? "active" : "btn-primary";
            return `btn btn-sm rounded-0 ${btnStyle}`;
          }}
        >
          <Icons.InsertChartOutlined height={16} widht={16} /> Analysis
        </NavLink>
        <NavLink
          to={`/dashboard/clusters/${clusterId}/new-products`}
          end
          className={({ isActive }) => {
            const btnStyle = isActive ? "active" : "btn-primary";
            return `btn btn-sm rounded-0 ${btnStyle}`;
          }}
        >
          <Icons.Ucube height={16} widht={16} />
          New Products
        </NavLink>
        <NavLink
          to={`/dashboard/clusters/${clusterId}/timeline`}
          end
          className={({ isActive }) => {
            const btnStyle = isActive ? "active" : "btn-primary";
            return `btn btn-sm rounded-0 ${btnStyle}`;
          }}
        >
          <Icons.FiCalendarMonth height={16} widht={16} />
          Timeline
        </NavLink>
      </header>
      <div className="mx-n4 mx-lg-n6 px-lg-6 position-relative">
        <nav className="mb-2" aria-label="breadcrumb">
          <ol className="breadcrumb mb-0">
            <li className="breadcrumb-item">
              <a href="#!"></a>
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
            {mainCategory ? (
              <>
                <li className="breadcrumb-item">
                  <a href="#!"></a>
                  <NavLink
                    to={`/dashboard/clusters/${clusterId}/analysis`}
                    end
                    className={({ isActive, isPending }) => {
                      return isActive ? "active" : isPending ? "pending" : "";
                    }}
                  >
                    {data?.name}
                  </NavLink>
                </li>

                <li className="breadcrumb-item active">{mainCategory}</li>
              </>
            ) : (
              <>
                <li className="breadcrumb-item active">{data?.name}</li>
              </>
            )}
          </ol>
        </nav>
        {/* Main Content Here */}
        <Outlet />
      </div>
    </ProductInstasearchContainer>
  );
}

export default ClusterLayout;
