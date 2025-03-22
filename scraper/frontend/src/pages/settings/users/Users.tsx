import TableLoader from "@/components/loader/TableLoader";
import UserDeactivateModal from "@/components/modals/UserDeactivateModal";
import UsersTable from "@/components/tables/UsersTable";
import { useQueryUsers } from "@/services/user.service";

function Users() {
  const { data, isLoading, error } = useQueryUsers();

  if (error && error.code?.includes("ERR_NETWORK")) {
    throw error;
  }

  return (
    <>
      <div className="g-2 mb-4">
        <div className="col-auto">
          <h3 className="mb-0">Users</h3>
        </div>
      </div>
      {isLoading ? <TableLoader /> : <UsersTable data={data} />}
      <UserDeactivateModal />
    </>
  );
}

export default Users;
