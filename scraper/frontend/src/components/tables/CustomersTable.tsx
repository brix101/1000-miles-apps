import { Icons } from "@/assets/icons";
import CustomerRow from "@/components/rows/CustomerRow";
import useItemFilters from "@/hooks/useItemFilters";
import useItemPagination from "@/hooks/useItemPagination";
import { CustomersEntity } from "@/schema/customer.schema";
import { useBoundStore } from "@/store";
import { useState } from "react";
import { Table } from "react-bootstrap";
import { PaginationSection, PaginationStatus } from "../PaginationComponent";
import { Inputs } from "../inputs";

function CustomersTable({ data }: { data?: CustomersEntity }) {
  const [filter, setFilter] = useState<string | undefined>(undefined);
  const {
    auth: { user },
  } = useBoundStore();

  const { result } = useItemFilters({
    rows: data?.customers ?? [],
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

  return (
    <>
      <div className="row mb-4">
        <div className="col-auto">
          <div className="search-box">
            <Inputs.Primary
              type="search"
              placeholder="Search user"
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
        <div className="col-2 d-flex d-none">
          <button className="btn btn-icon btn-phoenix-primary btn-sm me-1">
            <Icons.UFilter height={20} width={20} />
          </button>
          <button className="btn btn-icon btn-phoenix-primary  btn-sm me-1">
            <Icons.ULayerGroup height={20} width={20} />
          </button>
        </div>
      </div>
      <div className="mx-n4 px-4 mx-lg-n6 px-lg-6 bg-white border-top border-bottom border-200 position-relative top-1">
        <div className="min-vh-70">
          <Table responsive className="fs--1">
            <thead>
              <tr>
                <th className="white-space-nowrap fs--1 align-middle ps-0"></th>
                <th
                  className="sort align-middle pe-5 text-uppercase"
                  scope="col"
                  data-sort="customer"
                  // onClick={() => handleTableSort("name")}
                >
                  CUSTOMER
                </th>
                <th
                  className="sort align-middle pe-5 text-uppercase white-space-nowrap"
                  scope="col"
                  data-sort="email"

                  // onClick={() => handleTableSort("totalProducts")}
                >
                  Total <br /> Products
                </th>
                <th
                  className="sort align-middle text-start text-uppercase"
                  scope="col"
                  data-sort="total-orders"

                  // onClick={() => handleTableSort("website")}
                >
                  Website
                </th>
                <th
                  className="sort align-middle ps-3 text-uppercase white-space-nowrap"
                  scope="col"
                  data-sort="total-spent"

                  // onClick={() => handleTableSort("frequency")}
                >
                  frequency <br />
                  of scraping
                </th>
                <th
                  className="sort align-middle ps-7 text-uppercase"
                  scope="col"
                  data-sort="city"

                  // onClick={() => handleTableSort("lastTimeScrapped")}
                >
                  last time <br />
                  scraped
                </th>
                <th
                  className="sort align-middle text-uppercase white-space-nowrap"
                  scope="col"
                  data-sort="last-seen"

                  // onClick={() => handleTableSort("status")}
                >
                  scraping
                  <br /> status
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
                <CustomerRow key={index} {...prop} />
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
    </>
  );
}

export default CustomersTable;
