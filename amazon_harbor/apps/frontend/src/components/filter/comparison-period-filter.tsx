import ComparisonPeriodRadio from "@/components/custom-radio/comparison-period-radio";
import DateRangeSearchSelect from "@/components/search-select/date-range-search-select";
import { defaultComparisonPeriod } from "@/contant/index.constant";
import { useSearchParams } from "react-router-dom";
import { Input } from "../ui/input";

function ComparisonPeriodFilter() {
  const [searchParams, setSearchParams] = useSearchParams();
  const noOfPeriods = searchParams.get("comparison-number") ?? "1";
  const comparisonPeriod =
    searchParams.get("comparison-period") ?? defaultComparisonPeriod;

  const isCustomDates = comparisonPeriod === "CUSTOM_COMPARISON";

  function handlePeriodChange(e: React.ChangeEvent<HTMLInputElement>) {
    searchParams.set("comparison-period", e.target.id);
    setSearchParams(searchParams);
  }

  const handleNoOfPeriodChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = Number(e.target.value);
    const value = Math.max(0, inputValue);

    searchParams.set("comparison-number", value.toString());
    setSearchParams(searchParams);
  };

  return (
    <>
      <p className="text-700 lead mb-2 mt-4">Comparison Period</p>
      <div className="row mb-2">
        <div className="col-4">
          <ComparisonPeriodRadio
            selectedValue={comparisonPeriod}
            onChange={handlePeriodChange}
          />
        </div>
        <div className="col-6">
          <div className="row d-none">
            <label className="col-4 col-form-label">Number of Periods</label>
            <div className="col-4">
              <Input
                type="number"
                value={noOfPeriods}
                onChange={handleNoOfPeriodChange}
              />
            </div>
          </div>
        </div>
        <div className="col-4"></div>
      </div>
      <div className="col-8 row">
        <DateRangeSearchSelect
          intervalKey="comparison-interval"
          isDisabled={!isCustomDates}
        />
      </div>
    </>
  );
}

export default ComparisonPeriodFilter;
