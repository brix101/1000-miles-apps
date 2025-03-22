import { Icons } from "@/assets/icons";
import React, { Ref, forwardRef, useState } from "react";
import { FieldError } from "react-hook-form";
import ErrorContainer from "../container/ErrorContainer";

interface ComponentProps
  extends React.InputHTMLAttributes<HTMLInputElement>,
    React.AriaAttributes {
  error?: FieldError;
  label?: string;
}

const PasswordInput: React.FC<ComponentProps> = forwardRef<
  HTMLInputElement,
  ComponentProps
>(({ error, label, ...props }: ComponentProps, ref: Ref<HTMLInputElement>) => {
  const [isPassShow, setPassShow] = useState(false);
  const inputLength = props.value?.toString().length;

  return (
    <div className="text-start">
      {label ? <label className="form-label">{label}</label> : <></>}
      <div className="form-icon-container">
        <input
          ref={ref}
          className={`form-control form-password form-icon-input custom-padding-right
              ${error ? "is-invalid" : ""}
            `}
          type={isPassShow ? "text" : "password"}
          {...props}
        />
        <Icons.FKey
          className="text-900 fs--1 form-icon"
          width={10}
          height={10}
        />

        <button
          type="button"
          className="btn btn-icon password-button"
          disabled={inputLength ? inputLength <= 0 : true}
          onClick={() => setPassShow((prev) => !prev)}
        >
          {isPassShow ? <Icons.FiEyeOff /> : <Icons.FiEye />}
        </button>
      </div>
      <ErrorContainer error={error} />
    </div>
  );
});

export default PasswordInput;
