import { useSearchParams } from "react-router-dom";
import { SingleValue } from "react-select";
import { ShipmentStatusSelect } from "../custom-select/shipment-status-select";

function ShipmentStatusSearchSelect() {
  const [searchParams, setSearchParams] = useSearchParams();
  const status = searchParams.get("status") ?? "ALL";

  function handleStatusSelectChange(
    e: SingleValue<{
      value: string;
      label: string;
    }>
  ) {
    if (e?.value) {
      searchParams.set("status", e.value);
    } else {
      searchParams.delete("status");
    }

    setSearchParams(searchParams);
  }

  return (
    <div className="row">
      <label className="col-5 pe-0 col-form-label">Shipment Status</label>
      <div className="col-7">
        <ShipmentStatusSelect
          value={status}
          onChange={handleStatusSelectChange}
        />
      </div>
    </div>
  );
}

export default ShipmentStatusSearchSelect;
