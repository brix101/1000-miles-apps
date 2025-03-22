import React from "react";
import { ButtonProps } from "react-bootstrap";

const CustomToggleButton = React.forwardRef<
  HTMLButtonElement,
  ButtonProps & { indicator?: boolean }
>(({ children, indicator, ...rest }, ref) => (
  <button
    ref={ref}
    {...rest}
    className={`btn btn-icon btn-phoenix-primary ${
      indicator ? "icon-indicator icon-indicator-primary" : ""
    }`}
  >
    {children}
  </button>
));

const CustomToggle = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ children, ...rest }, ref) => (
    <button ref={ref} {...rest} className={"btn"}>
      {children}
    </button>
  )
);

export { CustomToggle, CustomToggleButton };
