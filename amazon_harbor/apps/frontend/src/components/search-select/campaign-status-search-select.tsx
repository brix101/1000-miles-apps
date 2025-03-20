import CampaignStatusRadio from "@/components/custom-radio/campaign-status-radio";
import { defaultCampaignStatus } from "@/contant/index.constant";
import { useSearchParams } from "react-router-dom";

function CampaignStatusSearchSelect() {
  const [searchParams, setSearchParams] = useSearchParams();
  const status = searchParams.get("status") ?? defaultCampaignStatus;

  function handleCampaignStatusChange(e: React.ChangeEvent<HTMLInputElement>) {
    searchParams.set("status", e.target.id);
    setSearchParams(searchParams);
  }

  return (
    <div className="row">
      <label className="col-4 pe-0 col-form-label single-line-text">
        Campaign Status
      </label>
      <div className="col-auto row">
        <CampaignStatusRadio
          onChange={handleCampaignStatusChange}
          selectedValue={status}
        />
      </div>
    </div>
  );
}

export default CampaignStatusSearchSelect;
