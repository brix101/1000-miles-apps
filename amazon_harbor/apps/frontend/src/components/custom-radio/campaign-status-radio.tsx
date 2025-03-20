import { campaignStatuses } from "@/contant/index.constant";
import { InputHTMLAttributes } from "react";

interface ProductStatusRadioProps
  extends InputHTMLAttributes<HTMLInputElement> {
  selectedValue?: string;
}

function CampaignStatusRadio(props: ProductStatusRadioProps) {
  return (
    <div className="d-flex flex-row">
      {campaignStatuses.map((item, index) => {
        return (
          <div
            className="custom-control custom-radio custom-control-inline d-flex align-items-center pe-2"
            key={index}
          >
            <input
              id={item}
              type="radio"
              name="productStatus"
              className="custom-control-input"
              checked={props.selectedValue === item}
              onChange={props.onChange}
            />
            <label className="custom-control-label px-2" htmlFor={item}>
              {item}
            </label>
          </div>
        );
      })}
    </div>
  );
}

export default CampaignStatusRadio;
