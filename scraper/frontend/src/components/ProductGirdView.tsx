import ProductCard from "@/components/cards/ProductCard";
import { useContext } from "react";
import { ProductHitsContext } from "./hits/ProductHits";

function ProductGridView() {
  const { products } = useContext(ProductHitsContext);

  return (
    <div className="mx-n4 px-4 mx-lg-n6 px-lg-6 position-relative top-1 products-grid-container pb-5">
      {products.map((prop) => (
        <ProductCard key={prop.id} {...prop} />
      ))}
    </div>
  );
}

export default ProductGridView;
