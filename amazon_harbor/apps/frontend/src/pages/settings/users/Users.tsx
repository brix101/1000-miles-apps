import PageHeaderContainer from "@/components/container/page-header-Container";
import { userColumns } from "@/components/data-table/columns/user-columns";
import { DataTable } from "@/components/data-table/data-table";
import useGetUsers from "@/hooks/queries/useGetUsers";
import { NavLink } from "react-router-dom";

function Users() {
  const { data, isLoading } = useGetUsers();

  return (
    <>
      <PageHeaderContainer>Settings - Users</PageHeaderContainer>
      <div id="users">
        <DataTable
          data={data ?? []}
          columns={userColumns}
          isLoading={isLoading}
          searchPlaceHolder="Search users..."
          toolBarChildren={
            <div className="d-flex align-items-center">
              <NavLink className="btn btn-primary btn-sm" to="add">
                Create new user
              </NavLink>
            </div>
          }
        />
      </div>
    </>
  );
}

export default Users;
