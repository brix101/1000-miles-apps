import { Icons } from "@/assets/icons";
import { Inputs } from "@/components/inputs";
import TimelineRow, { IGroup } from "@/components/rows/TimelineRow";
import useGetClusterFilter from "@/hooks/useGetClusterFilter";
import useItemPagination from "@/hooks/useItemPagination";
import { ProductEntity } from "@/schema/product.schema";
import { useQueryCluster } from "@/services/cluster.service";
import { useQueryFacetBatchSearch } from "@/services/facets.service";
import { useState } from "react";
import { Table } from "react-bootstrap";
import { useParams } from "react-router-dom";
import {
  PaginationSection,
  PaginationStatus,
} from "../../components/PaginationComponent";

interface IGroupBy {
  id: string;
  name: string;
}

export interface IGroupData {
  [key: string]: IGroup;
}

interface IGroupObjects {
  name: string;
  products: ProductEntity[];
}

interface IGroups {
  [key: string]: IGroupObjects;
}

function ClusterTimeline() {
  const { clusterId } = useParams();
  const { data } = useQueryCluster(clusterId ?? "");
  const queryFilter = useGetClusterFilter(data);

  const {
    data: hitsResult,
    isLoading,
    isFetching,
  } = useQueryFacetBatchSearch({
    clusterId: clusterId ?? "",
    filters: queryFilter,
  });

  const [year, setYear] = useState<number>(new Date().getFullYear());
  const [groupBy, setGroupBy] = useState<string>("0");

  function handlePrevClick() {
    setYear(year - 1);
  }
  function handleNextClick() {
    setYear(year + 1);
  }

  const groupByData: Array<IGroupBy> = [
    { id: "0", name: "Customer" },
    { id: "1", name: "Category" },
  ];

  const groups: IGroups | undefined = hitsResult?.reduce((result, obj) => {
    let groupKey;
    if (groupBy === "0") {
      groupKey = obj.customer_name ?? "";
    } else {
      const productCategories = obj.scraper_categories ?? [];
      const mainCategory = productCategories.find(
        (category) => category.level === 0
      );
      groupKey = mainCategory?.name ?? "";
    }

    if (!result[groupKey]) {
      result[groupKey] = { name: groupKey, products: [] };
    }

    result[groupKey].products.push(obj);
    return result;
  }, {} as IGroups);

  const result = groups ? Object.values(groups) : [];

  const { currentItems, paginationProps, statusProps } = useItemPagination({
    items: result,
    itemsPerPage: 15,
  });

  return (
    <>
      <div className="row g-2 mb-4">
        <div className="col-auto">
          <h3 className="mb-0">{data?.name}</h3>
        </div>
      </div>
      <div className="row pb-4">
        <div className="col-4"></div>
        <div className="col-4">
          <div className="d-flex justify-content-center">
            <button
              className="btn-timeline-year btn-link"
              style={{}}
              onClick={handlePrevClick}
              //   disabled={currentIndex === 0}
            >
              <Icons.FiChevronLeft width={40} height={40} />
            </button>

            <h3 className="px-10" style={{ color: "#141824", fontWeight: 600 }}>
              {year}
            </h3>

            <button
              className="btn-timeline-year btn-link"
              style={{}}
              onClick={handleNextClick}
              //   disabled={currentIndex === products.length - 1}
            >
              <Icons.FiChevronRight width={40} height={40} />
            </button>
          </div>
        </div>
        <div className="col-4 d-flex">
          <p
            className="pt-2 pr-0"
            style={{
              color: "#141824",
              fontSize: "14px",
              fontWeight: 700,
              width: "98px",
              marginBottom: 0,
            }}
          >
            Group By:
          </p>
          <div style={{ width: "200px", paddingLeft: 0 }}>
            <Inputs.Select
              label=""
              placeholder=""
              defaultValue={"Customer"}
              onChange={(e) => setGroupBy(e.target.value)}
              options={groupByData?.map((group) => ({
                value: group.id as string,
                label: group.name,
              }))}
            />
          </div>
        </div>
      </div>
      <div
        className="mx-n4 px-4 mx-lg-n6 px-lg-6 bg-white border-top border-bottom border-200 position-relative top-1"
        style={{ marginTop: "22px" }}
      >
        <div>
          <Table responsive className="fs--1">
            <thead style={{ borderColor: "#FFFFFF" }}>
              <tr>
                <th
                  className="sort align-middle pe-5 text-uppercase"
                  style={{ width: "125px" }}
                ></th>
                <th
                  className="sort align-middle pe-5 text-uppercase white-space-nowrap"
                  style={{ width: "125px", borderRight: "1px solid #E3E6ED" }}
                >
                  JANUARY
                </th>
                <th
                  className="sort align-middle text-start text-uppercase"
                  style={{ width: "125px", borderRight: "1px solid #E3E6ED" }}
                >
                  FEBRUARY
                </th>
                <th
                  className="sort align-middle ps-3 text-uppercase white-space-nowrap"
                  style={{ width: "125px", borderRight: "1px solid #E3E6ED" }}
                >
                  MARCH
                </th>
                <th
                  className="sort align-middle text-uppercase white-space-nowrap"
                  style={{ width: "125px", borderRight: "1px solid #E3E6ED" }}
                >
                  APRIL
                </th>
                <th
                  className="sort align-middle text-uppercase white-space-nowrap"
                  style={{ width: "125px", borderRight: "1px solid #E3E6ED" }}
                >
                  MAY
                </th>
                <th
                  className="sort align-middle text-uppercase white-space-nowrap"
                  style={{ width: "125px", borderRight: "1px solid #E3E6ED" }}
                >
                  JUNE
                </th>
                <th
                  className="sort align-middle text-uppercase white-space-nowrap"
                  style={{ width: "125px", borderRight: "1px solid #E3E6ED" }}
                >
                  July
                </th>
                <th
                  className="sort align-middle text-uppercase white-space-nowrap"
                  style={{ width: "125px", borderRight: "1px solid #E3E6ED" }}
                >
                  AUGUST
                </th>
                <th
                  className="sort align-middle text-uppercase white-space-nowrap"
                  style={{ width: "125px", borderRight: "1px solid #E3E6ED" }}
                >
                  SEPTEMBER
                </th>
                <th
                  className="sort align-middle text-uppercase white-space-nowrap"
                  style={{ width: "125px", borderRight: "1px solid #E3E6ED" }}
                >
                  OCTOBER
                </th>
                <th
                  className="sort align-middle text-uppercase white-space-nowrap"
                  style={{ width: "125px", borderRight: "1px solid #E3E6ED" }}
                >
                  NOVEMBER
                </th>
                <th
                  className="sort align-middle text-uppercase white-space-nowrap"
                  style={{ width: "125px", borderRight: "1px solid #E3E6ED" }}
                >
                  DECEMBER
                </th>
              </tr>
            </thead>
            <tbody className="list">
              {isLoading || isFetching ? (
                <tr className="hover-actions-trigger btn-reveal-trigger position-static">
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td
                    className="align-middle white-space-nowrap fw-bold text-1100"
                    style={{ height: "84px", padding: 0 }}
                  >
                    <span
                      className="spinner-border spinner-border-sm"
                      style={{ height: 44, width: 44 }}
                    ></span>
                  </td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                </tr>
              ) : (
                <>
                  {currentItems.map((prop, index) => (
                    <TimelineRow key={index} group={prop} year={year} />
                  ))}
                </>
              )}
            </tbody>
          </Table>
        </div>
        {isLoading || isFetching ? (
          <></>
        ) : (
          <div className="row align-items-center justify-content-between py-2 pe-0 fs--1">
            <div className="col-auto">
              <PaginationStatus {...statusProps} />
            </div>
            <div className="col-auto">
              <PaginationSection {...paginationProps} />
            </div>
          </div>
        )}
      </div>
    </>
  );
}

export default ClusterTimeline;
