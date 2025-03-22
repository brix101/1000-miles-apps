import { QUERY_CUSTOMERS_KEY } from "@/constant/query.constant";
import { CustomersEntity } from "@/schema/customer.schema";
import { ProductEntity } from "@/schema/product.schema";
import { useBoundStore } from "@/store";
import { useQueryClient } from "@tanstack/react-query";
import { Hit as AlgoliaHit } from "instantsearch.js/es/types";
import { Highlight } from "react-instantsearch-hooks-web";

function ProductCard(product: AlgoliaHit<ProductEntity>) {
  const queryClient = useQueryClient();
  const { setProductToModal } = useBoundStore();
  const data = queryClient.getQueryData([
    QUERY_CUSTOMERS_KEY,
  ]) as CustomersEntity;

  const customer = data?.customers?.find(
    (customer) => customer.id === product.customer_id
  );

  const currencySymbol = customer?.currency.symbol ?? "$";

  return (
    <div className="product-grid-item card p-2">
      <img
        className="cursor-pointer lazy"
        src={product.image ?? ""}
        alt={`product ${product.id}`}
        onClick={() => setProductToModal(product)}
        style={{
          maxWidth: "100%",
          maxHeight: "100%",
          display: "block",
          margin: "auto",
          objectFit: "contain",
        }}
      />
      <div className="card-body px-5 pb-2">
        <p className="fs--1 text-limit">
          {/* {product.name}   */}
          <Highlight hit={product} attribute="name" />
        </p>
        <span className="fs--1 fw-black">
          {currencySymbol} {product.price_usd?.toFixed(2)}
        </span>
      </div>
    </div>
  );
}

export default ProductCard;
