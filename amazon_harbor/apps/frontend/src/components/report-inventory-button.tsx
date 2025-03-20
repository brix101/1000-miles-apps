import useReportInventoryMutation from "@/hooks/mutations/useReportInventoryMutation";
import { IProcurementProductsQuery } from "@/services/procurement.service";
import { Button } from "./ui/button";

interface ReportButtonProps {
  query: IProcurementProductsQuery;
}

function ReportInventoryButton({ query }: ReportButtonProps) {
  const { mutate, isPending } = useReportInventoryMutation();

  return (
    <Button
      disabled={isPending}
      onClick={() => mutate(query)}
      className="d-flex justify-content-center d-none"
    >
      {isPending ? (
        <span className="spinner-border spinner-border-xs"></span>
      ) : null}
      <span className="px-2">Download Excel </span>
    </Button>
  );
}

export default ReportInventoryButton;
