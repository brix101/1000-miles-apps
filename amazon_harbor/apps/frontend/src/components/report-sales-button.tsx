import useReportSalesMutation from "@/hooks/mutations/useReportSalesMutation";
import { ISalesOrderMetricQuery } from "@/services/sale.service";
import { Button } from "./ui/button";

interface ReportButtonProps {
  query: ISalesOrderMetricQuery;
}

function SalesReportButton({ query }: ReportButtonProps) {
  const { mutate, isPending } = useReportSalesMutation();

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

export default SalesReportButton;
