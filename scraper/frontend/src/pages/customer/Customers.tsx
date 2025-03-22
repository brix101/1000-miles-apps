import TableLoader from "@/components/loader/TableLoader";
import CustomerDeactivateModal from "@/components/modals/CustomerDeactivateModal";
import CustomersTable from "@/components/tables/CustomersTable";
import { useQueryCustomers } from "@/services/customer.service";

function Customer() {
  const { data, isLoading, error } = useQueryCustomers();

  if (error?.response?.status === 500) {
    throw error;
  }

  return (
    <>
      <div className="g-2 mb-4">
        <div className="col-auto">
          <h2 className="mb-0">All Customers</h2>
        </div>
      </div>
      {isLoading ? <TableLoader /> : <CustomersTable data={data} />}
      <CustomerDeactivateModal />
    </>
  );
}

export default Customer;
