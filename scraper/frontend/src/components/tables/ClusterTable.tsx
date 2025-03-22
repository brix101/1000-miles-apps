import { Icons } from "@/assets/icons";
import useItemFilters from "@/hooks/useItemFilters";
import useItemPagination from "@/hooks/useItemPagination";
import { ClustersEntity } from "@/schema/cluster.schema";
import { useBoundStore } from "@/store";
import { useState } from "react";
import { Table } from "react-bootstrap";
import { PaginationSection, PaginationStatus } from "../PaginationComponent";
import { Inputs } from "../inputs";
import ClusterRow from "../rows/ClusterRow";

interface Props {
  data?: ClustersEntity;
}

function ClusterTable({ data }: Props) {
  const { user } = useBoundStore((state) => state.auth);
  const { setCreateOpen } = useBoundStore((state) => state.cluster);

  const [filter, setFilter] = useState<string | undefined>(undefined);

  const { result } = useItemFilters({
    rows: data?.clusters ?? [],
    skip: ["_id", "id"],
    filter,
  });

  const { currentItems, paginationProps, statusProps } = useItemPagination({
    items: result,
    itemsPerPage: 15,
  });

  function handleFilterString(event: React.ChangeEvent<HTMLInputElement>) {
    setFilter(event.target.value);
  }

  function handleCreateOpen() {
    setCreateOpen(true);
  }
  return (
    <>
      <div className="row align-items-center justify-content-between g-3 mb-4">
        <div className="col-10 col-sm-6 col-lg-4">
          <div className="search-box">
            <Inputs.Primary
              type="search"
              placeholder="Search cluster"
              leftIcon={
                <Icons.FiSearch
                  className="fas fa-search search-box-icon"
                  height={16}
                  width={16}
                />
              }
              value={filter}
              onChange={handleFilterString}
            />
          </div>
        </div>
        <div className="col-2 flex-grow-1">
          <button className="btn btn-icon btn-phoenix-primary btn-sm me-1 d-none">
            <Icons.UFilter height={20} width={20} />
          </button>
        </div>
        <div className="col-auto">
          <div className="d-flex align-items-center">
            <button className="btn btn-primary" onClick={handleCreateOpen}>
              <Icons.FiPlus className="me-2" height={16} width={16} />
              Create cluster
            </button>
          </div>
        </div>
      </div>

      {data ? (
        <div className="mx-n4 mx-lg-n6 px-4 px-lg-6 mb-9 bg-white border-y border-300 mt-2 position-relative top-1">
          <div className="min-vh-70">
            <Table responsive className="fs--1">
              <thead>
                <tr>
                  <th className="align-middle text-start text-uppercase">
                    Name
                  </th>
                  <th className="align-middle pe-5 text-uppercase white-space-nowrap">
                    Product Count
                  </th>
                  <th className="align-middle text-start text-uppercase">
                    Created By
                  </th>
                  <th className="align-middle ps-3 text-uppercase white-space-nowrap">
                    Date Posted
                  </th>
                  {user?.permission_id?.write ? (
                    <th
                      className="text-end "
                      style={{ width: "10%", minWidth: "50px" }}
                    ></th>
                  ) : (
                    <></>
                  )}
                </tr>
              </thead>
              <tbody className="list">
                {currentItems.map((prop, index) => (
                  <ClusterRow key={index} {...prop} />
                ))}
              </tbody>
            </Table>
          </div>
          <div className="row align-items-center justify-content-between py-2 pe-0 fs--1">
            <div className="col-auto">
              <PaginationStatus {...statusProps} />
            </div>
            <div className="col-auto">
              <PaginationSection {...paginationProps} />
            </div>
          </div>
        </div>
      ) : (
        <div className="mx-n4 mx-lg-n6 px-4 px-lg-6 mb-9 mt-2 position-relative top-1">
          <div className="min-vh-70 d-flex justify-content-center align-items-center">
            <div className="card bg-white">
              <div className="card-header d-flex justify-content-center px-4 py-3 border-bottom">
                <h4 className="mb-0 d-flex align-items-center gap-2">
                  No cluster data created yet
                </h4>
              </div>
              <div className="card-body p-0">
                <div className="h-20 p-3">
                  <p className="text-center mb-0">
                    Please create the first data by clicking the button <br />
                    bellow or the button located at the top right
                  </p>
                </div>
              </div>
              <div className="card-footer d-flex justify-content-center align-items-center gap-2 border-top ps-3 pe-4 py-3">
                <button className="btn btn-primary" onClick={handleCreateOpen}>
                  Create new cluster
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default ClusterTable;
