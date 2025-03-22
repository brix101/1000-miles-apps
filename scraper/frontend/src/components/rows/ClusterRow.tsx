import { Icons } from "@/assets/icons";
import { QUERY_CLUSTER_KEY } from "@/constant/query.constant";
import useGetClusterFilter from "@/hooks/useGetClusterFilter";
import { ClusterEntity } from "@/schema/cluster.schema";
import { useQueryFacetBatchSearch } from "@/services/facets.service";
import { useBoundStore } from "@/store";
import { useQueryClient } from "@tanstack/react-query";
import moment from "moment";
import { Dropdown } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

function ClusterRow(cluster: ClusterEntity) {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const {
    auth: { user },
    cluster: { setToRemove, setToUpdate },
  } = useBoundStore();

  const queryFilter = useGetClusterFilter(cluster);

  const { data: algoliaData, isLoading: isAlgoliaLoading } =
    useQueryFacetBatchSearch({
      clusterId: cluster.id ?? "",
      filters: queryFilter,
    });

  const createDate = moment(cluster.created_at).format("MMM DD, YYYY");

  function handleNavigate() {
    queryClient.setQueryData([QUERY_CLUSTER_KEY, cluster.id], cluster);
    navigate(`/dashboard/clusters/${cluster.id}`);
  }

  function handleRemoveShow() {
    setToRemove(cluster);
  }

  function handleEditShow() {
    setToUpdate(cluster);
  }

  return (
    <>
      <tr className="hover-actions-trigger btn-reveal-trigger position-static">
        <td className="align-middle white-space-nowrap pe-5">
          <a
            className="d-flex align-items-center fw-semi-bold text-capitalize px-2"
            href="#"
            onClick={handleNavigate}
          >
            <p className="mb-0 text-primary fw-bold"> {cluster.name}</p>
          </a>
        </td>
        <td className="align-middle white-space-nowrap pe-5 fw-bold">
          {isAlgoliaLoading ? (
            <span
              className="spinner-border spinner-border-sm"
              style={{ height: 16, width: 16 }}
            ></span>
          ) : (
            algoliaData?.length ?? 0
          )}
        </td>
        <td className="align-middle white-space-nowrap fw-semi-bold text-1000">
          {cluster.created_by.name}
        </td>
        <td className="align-middle white-space-nowrap text-1000 ps-7">
          {createDate}
        </td>
        {user?.permission_id?.write ? (
          <td className="align-middle text-700 text-end">
            <Dropdown>
              <Dropdown.Toggle variant="inherit" id="dropdown-basic" size="sm">
                <Icons.UEllipsisH height={16} width={16} />
              </Dropdown.Toggle>

              <Dropdown.Menu>
                <Dropdown.Item onClick={handleNavigate}>View</Dropdown.Item>
                <Dropdown.Item className="border-top" onClick={handleEditShow}>
                  Edit
                </Dropdown.Item>
                <Dropdown.Item
                  className="text-danger border-top"
                  onClick={handleRemoveShow}
                >
                  Remove
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          </td>
        ) : (
          <></>
        )}
      </tr>
    </>
  );
}

export default ClusterRow;
