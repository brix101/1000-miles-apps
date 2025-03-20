import { Marketplaceselect } from "@/components/custom-select/marketplaces-select";
import { defaultMarketplace } from "@/contant/index.constant";
import { SelectOption } from "@/types";
import { useSearchParams } from "react-router-dom";
import { SingleValue } from "react-select";

function MarketplaceSearchSelect() {
  const [searchParams, setSearchParams] = useSearchParams();
  const marketplace = searchParams.get("marketplace") ?? defaultMarketplace;

  function handleMarketplaceSelectChange(e: SingleValue<SelectOption>) {
    if (e?.value) {
      searchParams.set("marketplace", e.value);
    } else {
      searchParams.delete("marketplace");
    }

    setSearchParams(searchParams);
  }

  return (
    <div className="row">
      <label className="col-4 col-form-label">Marketplace</label>
      <div className="col-8">
        <Marketplaceselect
          value={marketplace}
          onChange={handleMarketplaceSelectChange}
        />
      </div>
    </div>
  );
}

export default MarketplaceSearchSelect;
