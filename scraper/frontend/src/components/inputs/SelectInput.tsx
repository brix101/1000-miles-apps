import React, { Ref, forwardRef } from "react";
import { FieldError } from "react-hook-form";
import ErrorContainer from "../container/ErrorContainer";

interface SelectOptions {
  value: string;
  label: string;
}

interface ComponentProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  error?: FieldError;
  label?: string;
  isLoading?: boolean;
  options?: SelectOptions[];
}

const SelectInput: React.FC<ComponentProps> = forwardRef<
  HTMLSelectElement,
  ComponentProps
>(
  (
    { error, label, isLoading, options, ...props }: ComponentProps,
    ref: Ref<HTMLSelectElement>
  ) => {
    return (
      <div className="text-start">
        {label ? <label className="form-label">{label}</label> : undefined}
        <select
          ref={ref}
          className={`form-select 
            ${error ? "is-invalid" : ""}
          `}
          defaultValue=""
          {...props}
        >
          <option value="" disabled>
            {isLoading ? "Loading" : props.placeholder}
          </option>
          {options?.map((option, index) => (
            <option key={index} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <ErrorContainer error={error} />
      </div>
    );
  }
);

export default SelectInput;
