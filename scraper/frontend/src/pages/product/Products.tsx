import ProductsContainer from "@/components/container/ProductsContainer";

function Products() {
  return (
    <>
      <div className="g-2 mb-4">
        <div className="col-auto">
          <h3 className="mb-0">All Products</h3>
        </div>
      </div>
      <ProductsContainer />
    </>
  );
}

export default Products;
