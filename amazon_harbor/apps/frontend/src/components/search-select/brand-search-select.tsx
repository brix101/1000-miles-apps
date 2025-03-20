import { BrandSelect } from "@/components/custom-select/brand-select";
import { defaultBrand } from "@/contant/index.constant";
import { SelectOption } from "@/types";
import { useSearchParams } from "react-router-dom";
import { SingleValue } from "react-select";

function BrandSearchSelect() {
  const [searchParams, setSearchParams] = useSearchParams();
  const brand = searchParams.get("brand") ?? defaultBrand;

  function handleBrandSelectChange(e: SingleValue<SelectOption>) {
    if (e?.value) {
      searchParams.set("brand", e.value);
    } else {
      searchParams.delete("brand");
    }

    setSearchParams(searchParams);
  }

  return (
    <div className="row">
      <label className="col-4 col-form-label pe-0">Brands</label>
      <div className="col-8 p-0">
        <BrandSelect value={brand} onChange={handleBrandSelectChange} />
      </div>
    </div>
  );
}

export default BrandSearchSelect;
