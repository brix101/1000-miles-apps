import PageHeaderContainer from "@/components/container/page-header-Container";
import ReturnPeriodContainer from "@/components/container/returns-period-container";
import ComparisonPeriodFilter from "@/components/filter/comparison-period-filter";
import PeriodFilter from "@/components/filter/period-filter";
import ReturnsGraphViewModal from "@/components/forms/ReturnsGraphViewModal";
import ResultCard from "@/components/result-card";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  comparisonPeriods,
  defaultComparisonPeriod,
  defaultMarketplace,
  defaultSalesPeriod,
} from "@/contant/index.constant";
import useGetReturn from "@/hooks/queries/useGetReturn";
import useGetReturnPerProduct from "@/hooks/queries/useGetReturnPerProduct";
import useBoundStore from "@/hooks/useBoundStore";
import useCreateQuery from "@/hooks/useCreateQuery";
import { calculatePercentage, getCurrencySymbol } from "@/lib/utils";
import { ISalesOrderMetricQuery } from "@/services/sale.service";
import { ReturnComparison } from "@/types/return";
import { Fragment } from "react";
import { useSearchParams } from "react-router-dom";

function Returns() {
  const setDialogItem = useBoundStore((state) => state.setDialogItem);
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

  const { data, isLoading, isFetching } = useGetReturn(query);

  const { data: returnedPerProduct } = useGetReturnPerProduct();

  return (
    <>
      <div className="d-flex justify-content-between">
        <PageHeaderContainer>Returns</PageHeaderContainer>
        <div>
          <Button size="sm" className="d-none">
            Download Excel
          </Button>
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
      <ReturnPeriodContainer query={query} />
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
                  totalSales={data?.returns.totalReturns.amount ?? 0}
                />
              );
            })}
          </>
        )}
      </div>

      <div className="d-flex justify-content-between">
        <p className="text-700 lead mb-2 mt-4">Return per Product</p>
        <div>
          <Button
            variant="success"
            size="sm"
            onClick={() =>
              setDialogItem({ item: <ReturnsGraphViewModal />, size: "xl" })
            }
          >
            See All
          </Button>
        </div>
      </div>

      <div className="mt-5 mx-n4 mx-lg-n6 px-4 px-lg-6 mb-9 bg-white border-y border-300 mt-2 position-relative top-1">
        <Table>
          <colgroup span={4}></colgroup>
          <colgroup span={3} className="bg-light"></colgroup>
          <colgroup span={3}></colgroup>

          <TableHeader>
            <TableRow>
              <TableHead colSpan={4}></TableHead>
              <TableHead colSpan={3}>
                Last Year (Jan-17, 2023 to Jan-18, 2023)
              </TableHead>
              <TableHead colSpan={3}>
                Custom Period (Aug-17, 2023 to Aug-18, 2023)
              </TableHead>
            </TableRow>
            <TableRow>
              <TableHead>Product Name</TableHead>
              <TableHead>Brand</TableHead>
              <TableHead>Return Amount</TableHead>
              <TableHead>Units Return</TableHead>

              <TableHead>Return Amount</TableHead>
              <TableHead>Units Return</TableHead>
              <TableHead>Comparison</TableHead>

              <TableHead>Return Amount</TableHead>
              <TableHead>Units Return</TableHead>
              <TableHead>Comparison</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {returnedPerProduct.slice(0, 5).map((returned, index) => {
              return (
                <TableRow key={index}>
                  <TableCell>{returned.productName}</TableCell>
                  <TableCell>{returned.brand}</TableCell>
                  <TableCell>
                    <span className="">
                      $ {returned.returnAmount.toFixed(2)}
                    </span>
                  </TableCell>
                  <TableCell>
                    <span className="">{returned.unitsReturned}</span>
                  </TableCell>
                  {returned.comparison.map((comparison, comIndex) => {
                    const returnedPercentage =
                      ((comparison.returnAmount - returned.returnAmount) /
                        comparison.returnAmount) *
                      100;

                    return (
                      <Fragment key={index + comIndex}>
                        <TableCell>
                          <span>$ {comparison.returnAmount.toFixed(2)}</span>
                        </TableCell>
                        <TableCell>
                          <span>$ {comparison.unitsReturned}</span>
                        </TableCell>
                        <TableCell>
                          <span>{returnedPercentage.toFixed(2)}%</span>
                        </TableCell>
                      </Fragment>
                    );
                  })}
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </>
  );
}

function ComparisonOverviewRow({
  isLoading,
  comparison,
  totalSales,
}: {
  isLoading?: boolean;
  comparison?: ReturnComparison;
  totalSales?: number;
}) {
  const salesComparison = comparison || {
    value: "",
    returns: {
      totalUnits: 0,
      totalReturns: { amount: 0, currencyCode: "" },
    },
  };

  const periodLabel = comparisonPeriods.find(
    (item) => item.value === salesComparison.value
  )?.label;

  const currencySymbol = getCurrencySymbol(
    comparison?.returns.totalReturns.currencyCode
  );
  const returns = salesComparison?.returns;

  const returnGrowth = calculatePercentage(
    salesComparison.returns.totalReturns.amount,
    totalSales || 0
  );

  const compSales = returns?.totalReturns.amount || 0;

  return (
    <div className="container row col-9">
      <div className="col px-1">
        <ResultCard
          title="Returned Compared"
          caption={`to ${periodLabel}`}
          isLoading={isLoading}
          value={`${returnGrowth.toFixed(2)} %`}
          color={returnGrowth >= 0 ? "success" : "danger"}
        />
      </div>
      <div className="col px-1">
        <ResultCard
          title="Total Returned"
          caption={periodLabel}
          isLoading={isLoading}
          value={`${currencySymbol} ${compSales.toFixed(2)}`}
          color={compSales >= 0 ? "success" : "danger"}
        />
      </div>
      <div className="col px-1">
        <ResultCard
          title="Total Units Return"
          caption={periodLabel}
          isLoading={isLoading}
          value={`${currencySymbol} ${returns.totalUnits}`}
          color={returns.totalUnits >= 0 ? "success" : "danger"}
        />
      </div>
    </div>
  );
}

export default Returns;
