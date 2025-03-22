import { Ref, forwardRef } from "react";
import { FieldError } from "react-hook-form";
import ErrorContainer from "../container/ErrorContainer";

interface ComponentProps
  extends React.InputHTMLAttributes<HTMLInputElement>,
    React.AriaAttributes {
  error?: FieldError;
  label?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

const PrimaryInput: React.FC<ComponentProps> = forwardRef<
  HTMLInputElement,
  ComponentProps
>(
  (
    { value, label, leftIcon, rightIcon, error, ...props }: ComponentProps,
    ref: Ref<HTMLInputElement>
  ) => {
    const newValue = value as string | number | readonly string[] | undefined;
    return (
      <div className="text-start">
        {label ? <label className="form-label">{label}</label> : <></>}
        <div className="form-icon-container">
          <input
            ref={ref}
            className={`form-control 
              ${rightIcon ? "custom-padding-right" : ""} 
              ${leftIcon ? "form-icon-input" : ""} 
              ${error ? "is-invalid" : ""}
            `}
            value={newValue}
            {...props}
          />
          {leftIcon ?? leftIcon}
          {rightIcon ?? rightIcon}
        </div>
        <ErrorContainer error={error} />
      </div>
    );
  }
);
export default PrimaryInput;
