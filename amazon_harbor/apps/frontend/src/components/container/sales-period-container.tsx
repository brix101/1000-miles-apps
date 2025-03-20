import ResultCard from "@/components/result-card";
import useGetSaleAndTraffic from "@/hooks/queries/useGetSaleAndTraffic";
import { getCurrencySymbol } from "@/lib/utils";
import { ISalesOrderMetricQuery } from "@/services/sale.service";

interface SalesPeriodContainer {
  query: ISalesOrderMetricQuery;
}

function SalesPeriodContainer({ query }: SalesPeriodContainer) {
  const { data, isLoading } = useGetSaleAndTraffic(query);

  const sales = data?.sales;
  const currencySymbol = getCurrencySymbol(data?.sales.totalSales.currencyCode);

  const totalSales = sales?.totalSales.amount || 0;
  const totalSpendings = data?.fees?.Amount || 0;
  const totalProfit = totalSales - totalSpendings;

  return (
    <div className="grid-container">
      <ResultCard
        title="Total Sales"
        isLoading={isLoading}
        value={`${currencySymbol} ${totalSales.toFixed(2)}`}
        color={totalSales >= 0 ? "success" : "danger"}
      />
      <ResultCard
        title="Total Profit"
        isLoading={isLoading}
        value={`${currencySymbol} ${totalProfit.toFixed(2)}`}
        color={totalProfit >= 0 ? "success" : "danger"}
      />
      <ResultCard
        title="Total Units Sold"
        isLoading={isLoading}
        value={sales?.totalUnits}
        color={sales && sales?.totalUnits >= 0 ? "success" : "danger"}
      />
      <ResultCard
        title="Total Spending"
        isLoading={isLoading}
        value={`${currencySymbol} ${totalSpendings.toFixed(2)}`}
        color="danger"
      />
    </div>
  );
}

export default SalesPeriodContainer;
