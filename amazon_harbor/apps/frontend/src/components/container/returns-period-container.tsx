import ResultCard from "@/components/result-card";
import useGetReturn from "@/hooks/queries/useGetReturn";
import { getCurrencySymbol } from "@/lib/utils";
import { ISalesOrderMetricQuery } from "@/services/sale.service";

interface SalesPeriodContainer {
  query: ISalesOrderMetricQuery;
}

function ReturnPeriodContainer({ query }: SalesPeriodContainer) {
  const { data, isLoading } = useGetReturn(query);

  const returns = data?.returns;
  const currencySymbol = getCurrencySymbol(returns?.totalReturns.currencyCode);

  const totalReturns = returns?.totalReturns.amount || 0;

  return (
    <div className="grid-container">
      <ResultCard
        title="Total Return"
        isLoading={isLoading}
        value={`${currencySymbol} ${totalReturns.toFixed(2)}`}
        color={totalReturns >= 0 ? "success" : "danger"}
      />
      <ResultCard
        title="Total Units Returned"
        isLoading={isLoading}
        value={returns?.totalUnits}
        color={returns && returns?.totalUnits >= 0 ? "success" : "danger"}
      />
    </div>
  );
}

export default ReturnPeriodContainer;
