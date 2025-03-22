import { FieldError } from "react-hook-form";

function ErrorContainer({ error }: { error?: FieldError }) {
  if (!error) return;

  return (
    <div className="p-1">
      <span className="invalid-input">{error?.message}</span>
    </div>
  );
}

export default ErrorContainer;
