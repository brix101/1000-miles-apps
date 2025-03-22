import ProductsContainer from "@/components/container/ProductsContainer";
import { useStats } from "react-instantsearch-hooks-web";
import { useParams } from "react-router-dom";

function NewProducts() {
  const { customerId } = useParams();
  const stats = useStats();

  const title = customerId ? `New Products (${stats.nbHits})` : "New Products";

  return (
    <>
      <div className="row g-2 mb-4">
        <div className="col-auto">
          <h3 className="mb-0">{title}</h3>
        </div>
      </div>
      <ProductsContainer />
    </>
  );
}

export default NewProducts;
