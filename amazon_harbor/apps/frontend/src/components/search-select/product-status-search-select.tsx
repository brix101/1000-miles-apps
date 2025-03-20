import ProductStatusRadio from "@/components/custom-radio/product-status-radio";
import { defaultProductStatus } from "@/contant/index.constant";
import { useSearchParams } from "react-router-dom";

function ProductStatusSearchSelect() {
  const [searchParams, setSearchParams] = useSearchParams();
  const status = searchParams.get("status") ?? defaultProductStatus;

  function handleProductStatusChange(e: React.ChangeEvent<HTMLInputElement>) {
    searchParams.set("status", e.target.id);
    setSearchParams(searchParams);
  }

  return (
    <div className="row">
      <label className="col-4 pe-0 col-form-label single-line-text">
        Product Status
      </label>
      <div className="col-auto row">
        <ProductStatusRadio
          onChange={handleProductStatusChange}
          selectedValue={status}
        />
      </div>
    </div>
  );
}

export default ProductStatusSearchSelect;
