import MarketplaceSearchSelect from "@/components/search-select/marketplaces-search-select";
import { salesPeriods } from "@/contant/index.constant";
import { ChangeEvent } from "react";
import { useSearchParams } from "react-router-dom";
import DateRangeSearchSelect from "../search-select/date-range-search-select";

function PeriodFilter() {
  const [searchParams, setSearchParams] = useSearchParams();
  const period = searchParams.get("period") ?? "YESTERDAY";
  const isCustomDates = period === "CUSTOM_PERIOD";

  const handleChange = (event: ChangeEvent<HTMLSelectElement>) => {
    searchParams.set("period", event.target.value);
    setSearchParams(searchParams);
  };

  return (
    <>
      <p className="text-700 lead mb-2">Period Filter</p>
      <div className="row">
        <div className="col-4 mb-2">
          <MarketplaceSearchSelect />
        </div>
      </div>
      <div className="row">
        <div className="col-4">
          <div className="row">
            <label className="col-4 col-form-label">Period</label>
            <div className="col-8">
              <select
                className="form-select"
                aria-label="Default select example"
                value={period}
                onChange={handleChange}
              >
                {salesPeriods.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
        <div className="col-8 row">
          <DateRangeSearchSelect isDisabled={!isCustomDates} />
        </div>
      </div>
    </>
  );
}

export default PeriodFilter;
