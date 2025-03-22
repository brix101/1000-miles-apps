import { Icons } from "@/assets/icons";
import useItemFilters from "@/hooks/useItemFilters";
import useItemPagination from "@/hooks/useItemPagination";
import { UsersEntity } from "@/schema/user.schema";
import { useBoundStore } from "@/store";
import React, { useState } from "react";
import { Table } from "react-bootstrap";
import { NavLink } from "react-router-dom";
import { PaginationSection, PaginationStatus } from "../PaginationComponent";
import { Inputs } from "../inputs";
import UserRow from "../rows/UserRow";

function UsersTable({ data }: { data?: UsersEntity }) {
  const {
    user: { selectedUser },
    addToSelectedUser,
    resetSelectedUser,
    addToDeactivateUser,
  } = useBoundStore();

  const [filter, setFilter] = useState<string | undefined>(undefined);

  const { result } = useItemFilters({
    rows: data?.users ?? [],
    skip: ["_id", "id"],
    filter,
  });

  const { currentItems, paginationProps, statusProps } = useItemPagination({
    items: result,
    itemsPerPage: 15,
  });

  const isCheck =
    currentItems.length > 0 && selectedUser.length === currentItems.length;
  const isIndeterminate = !isCheck && selectedUser.length > 0;

  function handleFilterString(event: React.ChangeEvent<HTMLInputElement>) {
    setFilter(event.target.value);
  }

  function handleCheckUser() {
    if (isCheck || isIndeterminate) {
      resetSelectedUser();
    } else {
      addToSelectedUser(currentItems.map((user) => user.id ?? ""));
    }
  }

  function handleDiactivateUser() {
    addToDeactivateUser(selectedUser);
  }

  return (
    <>
      <div className="row align-items-center justify-content-between g-3 mb-4">
        <div className="col-10 col-sm-6 col-lg-4">
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
        <div className="col-2 flex-grow-1">
          <button className="btn btn-icon btn-phoenix-primary btn-sm me-1 d-none">
            <Icons.UFilter height={20} width={20} />
          </button>
        </div>
        <div className="col-auto">
          <div className="d-flex align-items-center">
            <button
              className="btn btn-outline-danger me-2"
              disabled={!isCheck && !isIndeterminate}
              onClick={handleDiactivateUser}
            >
              Deactivate
            </button>
            <NavLink className="btn btn-primary" to={"/dashboard/users/new"}>
              <Icons.FiPlus className="me-2" height={16} width={16} />
              Add user
            </NavLink>
          </div>
        </div>
      </div>
      <div className="mx-n4 mx-lg-n6 px-4 px-lg-6 mb-9 bg-white border-y border-300 mt-2 position-relative top-1">
        <div className="min-vh-70">
          <Table responsive className="fs--1">
            <thead>
              <tr>
                <th className="white-space-nowrap fs--1 align-middle ps-0">
                  <div className="form-check mb-0 fs-0">
                    <Inputs.Check
                      className="form-check-input"
                      checked={isCheck}
                      indeterminate={isIndeterminate}
                      onChange={handleCheckUser}
                    />
                  </div>
                </th>
                <th
                  className="sort align-middle text-uppercase"
                  scope="col"
                  data-sort="name"
                >
                  Name
                </th>
                <th
                  className="sort align-middle text-uppercase"
                  scope="col"
                  data-sort="email"
                >
                  EMAIL
                </th>
                <th
                  className="sort align-middle pe-3"
                  scope="col"
                  data-sort="mobile_number"
                >
                  Company Role
                </th>
                <th
                  className="sort align-middle text-uppercase"
                  scope="col"
                  data-sort="city"
                  style={{ width: "10%" }}
                >
                  Status
                </th>
                <th
                  className="sort align-middle text-uppercase"
                  scope="col"
                  data-sort="last_active"
                  style={{ width: "10%" }}
                >
                  Permission
                </th>
                <th
                  className="sort align-middle text-end pe-0  text-uppercase"
                  scope="col"
                  data-sort="joined"
                  style={{ width: "10%" }}
                ></th>
              </tr>
            </thead>
            <tbody className="list">
              {currentItems?.map((user) => (
                <UserRow key={user.id} user={user} />
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

export default UsersTable;
