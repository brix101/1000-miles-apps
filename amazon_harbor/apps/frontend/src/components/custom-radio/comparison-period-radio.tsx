import { comparisonPeriods } from "@/contant/index.constant";
import { InputHTMLAttributes } from "react";

interface ComparisonPeriodRadioProps
  extends InputHTMLAttributes<HTMLInputElement> {
  selectedValue?: string;
}

function ComparisonPeriodRadio(props: ComparisonPeriodRadioProps) {
  return (
    <>
      {comparisonPeriods.map((item, index) => {
        return (
          <div className="custom-control custom-radio" key={index}>
            <input
              id={item.value}
              type="radio"
              className="custom-control-input"
              checked={props.selectedValue === item.value}
              onChange={props.onChange}
            />
            <label className="custom-control-label" htmlFor={item.value}>
              {item.label}
            </label>
          </div>
        );
      })}
    </>
  );
}

export default ComparisonPeriodRadio;
