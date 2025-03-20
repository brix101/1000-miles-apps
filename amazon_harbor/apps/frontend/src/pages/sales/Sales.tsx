import { useSearchParams } from "react-router-dom";

import PageHeaderContainer from "@/components/container/page-header-Container";
import SalesByProductsContainer from "@/components/container/sales-by-product-container";
import SalesPeriodContainer from "@/components/container/sales-period-container";
import SalesSummaryContainer from "@/components/container/sales-summary-container";
import ComparisonPeriodFilter from "@/components/filter/comparison-period-filter";
import PeriodFilter from "@/components/filter/period-filter";
import SalesReportButton from "@/components/report-sales-button";
import ResultCard from "@/components/result-card";
import { Button } from "@/components/ui/button";
import {
  comparisonPeriods,
  defaultComparisonPeriod,
  defaultMarketplace,
  defaultSalesPeriod,
} from "@/contant/index.constant";
import useGetSaleAndTraffic from "@/hooks/queries/useGetSaleAndTraffic";
import useCreateQuery from "@/hooks/useCreateQuery";
import { calculatePercentage, getCurrencySymbol } from "@/lib/utils";
import { ISalesOrderMetricQuery } from "@/services/sale.service";
import { SaleAndTrafficComparison } from "@/types/sale";

function Sales() {
  const [searchParams] = useSearchParams();

  const [query, updateQuery] = useCreateQuery<ISalesOrderMetricQuery>({
    marketplace: searchParams.get("marketplace") ?? defaultMarketplace,
    period: searchParams.get("period") ?? defaultSalesPeriod,
    interval: searchParams.get("interval"),
    comparisonPeriod:
      searchParams.get("comparison-period") ?? defaultComparisonPeriod,
    comparisonNumber: searchParams.get("comparison-number"),
    comparisonInterval: searchParams.get("comparison-interval"),
  });

  const { data, isLoading, isFetching } = useGetSaleAndTraffic(query);

  return (
    <>
      <div className="d-flex justify-content-between">
        <PageHeaderContainer>Sales</PageHeaderContainer>
        <div>
          <SalesReportButton query={query} />
        </div>
      </div>
      <PeriodFilter />
      <ComparisonPeriodFilter />
      <div className="row mt-5">
        <Button
          size="sm"
          className="w-25 d-flex justify-content-center"
          onClick={updateQuery}
          disabled={isFetching}
        >
          {isFetching ? (
            <span className="spinner-border spinner-border-xs"></span>
          ) : null}
          <span className="px-2">Apply</span>
        </Button>
      </div>

      <p className="text-700 lead mb-2 mt-4">Period Overview</p>
      <SalesPeriodContainer query={query} />

      <p className="text-700 lead mb-2 mt-4">Comparison Overview</p>
      <div className="container mb-4">
        {isLoading ? (
          <>
            <ComparisonOverviewRow isLoading />
          </>
        ) : (
          <>
            {data?.comparisons.map((comparison, index) => {
              return (
                <ComparisonOverviewRow
                  key={index}
                  comparison={comparison}
                  totalSales={data?.sales.totalSales.amount ?? 0}
                />
              );
            })}
          </>
        )}
      </div>

      <SalesByProductsContainer query={query} />

      <p className="text-700 lead mb-2 mt-4">Summary</p>

      <SalesSummaryContainer query={query} />
    </>
  );
}

function ComparisonOverviewRow({
  isLoading,
  comparison,
  totalSales,
}: {
  isLoading?: boolean;
  comparison?: SaleAndTrafficComparison;
  totalSales?: number;
}) {
  const salesComparison = comparison || {
    value: "",
    sales: {
      totalUnits: 0,
      totalSales: { amount: 0, currencyCode: "" },
    },
    fees: {
      Amount: 0,
      CurrencyCode: "USD",
    },
  };

  const periodLabel = comparisonPeriods.find(
    (item) => item.value === salesComparison.value
  )?.label;
  const currencySymbol = getCurrencySymbol(
    comparison?.sales.totalSales.currencyCode
  );
  const sales = salesComparison?.sales;

  const salesGrowth = calculatePercentage(
    salesComparison.sales.totalSales.amount,
    totalSales || 0
  );

  const compSales = sales?.totalSales.amount || 0;
  const compSpendings = salesComparison?.fees.Amount || 0;
  const compProfit = compSales - compSpendings;

  return (
    <div className="row">
      <div className="col px-1">
        <ResultCard
          title="Sales Growth Compared"
          caption={`to ${periodLabel}`}
          isLoading={isLoading}
          value={`${salesGrowth.toFixed(2)} %`}
          color={salesGrowth >= 0 ? "success" : "danger"}
        />
      </div>
      <div className="col px-1">
        <ResultCard
          title="Total Sales"
          caption={periodLabel}
          isLoading={isLoading}
          value={`${currencySymbol} ${compSales.toFixed(2)}`}
          color={compSales >= 0 ? "success" : "danger"}
        />
      </div>
      <div className="col px-1">
        <ResultCard
          title="Total Profit"
          caption={periodLabel}
          isLoading={isLoading}
          value={`${currencySymbol} ${compProfit.toFixed(2)}`}
          color={compProfit >= 0 ? "success" : "danger"}
        />
      </div>
      <div className="col px-1">
        <ResultCard
          title="Total Units Sold"
          caption={periodLabel}
          isLoading={isLoading}
          value={sales?.totalUnits}
          color={sales && sales?.totalUnits >= 0 ? "success" : "danger"}
        />
      </div>
      <div className="col px-1">
        <ResultCard
          title="Total Spending"
          caption={periodLabel}
          isLoading={isLoading}
          value={`${currencySymbol} ${compSpendings.toFixed(2)}`}
          color="danger"
        />
      </div>
    </div>
  );
}

export default Sales;
