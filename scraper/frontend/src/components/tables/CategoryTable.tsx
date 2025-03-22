import { Icons } from "@/assets/icons";
import useItemFilters from "@/hooks/useItemFilters";
import useItemPagination from "@/hooks/useItemPagination";
import { NestedCategoriesEntity } from "@/schema/category.schema";
import { useBoundStore } from "@/store";
import { useState } from "react";
import { Table } from "react-bootstrap";
import { PaginationSection, PaginationStatus } from "../PaginationComponent";
import CategoryAccordion from "../container/CategoryAccordion";
import { Inputs } from "../inputs";

function CategoryTable({ categories }: NestedCategoriesEntity) {
  const [filter, setFilter] = useState<string | undefined>(undefined);
  const {
    category: { setAddOpen },
  } = useBoundStore();

  function handleOpenAddCategory() {
    setAddOpen(true);
  }

  const { result } = useItemFilters({
    rows: categories,
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
      <div className="row align-items-center justify-content-between g-3 mb-4">
        <div className="col-10 col-sm-6 col-lg-4">
          <div className="search-box">
            <Inputs.Primary
              type="search"
              placeholder="Search category"
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
        <div className="col-auto">
          <div className="d-flex align-items-center">
            <button className="btn btn-primary" onClick={handleOpenAddCategory}>
              <Icons.FiPlus className="me-2" height={16} width={16} />
              Add Category
            </button>
          </div>
        </div>
      </div>
      <div className="mx-n4 mx-lg-n6 px-4 px-lg-6 mb-9 bg-white border-y border-300 mt-2 position-relative top-1">
        <div className="min-vh-70">
          <Table responsive className="fs--1">
            <thead>
              <tr>
                <th className="white-space-nowrap align-middle text-uppercase ps-0">
                  Category
                </th>
                <th className="align-middle text-end pe-0"></th>
              </tr>
            </thead>
            <tbody className="list">
              {currentItems.map((category) => (
                <tr key={category.id}>
                  <td className="align-middle fw-bold text-capitalize p-0">
                    <CategoryAccordion category={category} isPrimary />
                  </td>
                </tr>
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

export default CategoryTable;
