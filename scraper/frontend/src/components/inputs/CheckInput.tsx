import { InputHTMLAttributes, forwardRef, useEffect, useRef } from "react";

interface ComponentProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, "type"> {
  indeterminate?: boolean;
}

const CheckInput: React.FC<ComponentProps> = forwardRef<
  HTMLInputElement,
  ComponentProps
>(({ indeterminate, ...props }, ref) => {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.indeterminate = indeterminate || false;
    }
  }, [indeterminate]);

  useEffect(() => {
    if (ref) {
      if (typeof ref === "function") {
        ref(inputRef.current);
      } else {
        (ref as React.MutableRefObject<HTMLInputElement | null>).current =
          inputRef.current;
      }
    }
  }, [ref]);

  return <input type="checkbox" ref={inputRef} {...props} />;
});
// Forward the ref to the underlying input element
export default CheckInput;
