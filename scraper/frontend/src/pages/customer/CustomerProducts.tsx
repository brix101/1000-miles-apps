import ProductsContainer from "@/components/container/ProductsContainer";
import { useQueryCustomer } from "@/services/customer.service";
import { useParams } from "react-router-dom";

function CustomerProducts() {
  const { customerId } = useParams();
  const { data } = useQueryCustomer(customerId ?? "");

  return (
    <>
      <div className="g-2 mb-4">
        <div className="col-auto">
          <h3 className="mb-0">{`${data?.name}. (${data?.total_products} Products)`}</h3>
        </div>
      </div>
      <ProductsContainer />
    </>
  );
}

export default CustomerProducts;
