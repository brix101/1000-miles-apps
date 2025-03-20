import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { comparisonPeriods, salesPeriods } from "@/contant/index.constant";
import useGetSalesAndTrafficByProduct from "@/hooks/queries/useGetSalesAndTrafficByProduct";
import {
  calculatePercentage,
  getCurrencySymbol,
  getPeriodDates,
} from "@/lib/utils";
import { ISalesOrderMetricQuery } from "@/services/sale.service";
import dayjs from "dayjs";
import React from "react";

interface SalesSummaryContainerProps {
  query: ISalesOrderMetricQuery;
}

function SalesSummaryContainer({ query }: SalesSummaryContainerProps) {
  const { data, isLoading } = useGetSalesAndTrafficByProduct(query);

  const comparedPeriods = data?.comparedPeriods || [];
  const currentPeriod = data?.currentPeriod;

  const periodLabel = salesPeriods.find(
    (item) => item.value === currentPeriod?.value
  )?.label;
  const { startDate, endDate } = getPeriodDates(currentPeriod);
  return (
    <>
      <div className="mt-5 mx-n4 mx-lg-n6 px-4 px-lg-6 mb-9 bg-white border-y border-300 mt-2 position-relative top-1  placeholder-glow">
        <Table>
          <colgroup span={1} />
          <colgroup span={3} className="bg-light" />
          {comparedPeriods.map((_, index) => {
            const isLight = index % 2 === 0;
            return (
              <colgroup
                key={index}
                span={5}
                className={isLight ? "" : "bg-light"}
              />
            );
          })}

          <TableHeader>
            <TableRow>
              <TableHead colSpan={1}></TableHead>
              <TableHead colSpan={3}>
                {isLoading ? (
                  <span
                    className="placeholder w-100 rounded-2"
                    style={{ height: "20px" }}
                  />
                ) : (
                  <>
                    {periodLabel ? (
                      <>
                        {periodLabel} ({startDate} to {endDate})
                      </>
                    ) : (
                      <></>
                    )}
                  </>
                )}
              </TableHead>
              {comparedPeriods.map((period, index) => {
                const periodLabel = comparisonPeriods.find(
                  (item) => item.value === period.value
                )?.label;

                const startDate = dayjs(period.start).format("MMM-DD, YYYY");
                const endDate = dayjs(period.end).format("MMM-DD, YYYY");

                return (
                  <TableHead key={index} colSpan={5} className="text-nowrap">
                    {isLoading ? (
                      <span
                        className="placeholder w-100 rounded-2"
                        style={{ height: "20px" }}
                      />
                    ) : (
                      <>
                        {periodLabel ? (
                          <>
                            {periodLabel} ({startDate} to {endDate})
                          </>
                        ) : (
                          <></>
                        )}
                      </>
                    )}
                  </TableHead>
                );
              })}
            </TableRow>
            <TableRow>
              <TableHead>Product Name</TableHead>
              <TableHead>Units Ordered</TableHead>
              <TableHead>Sales</TableHead>
              <TableHead>Profit</TableHead>

              {comparedPeriods.map((_, index) => {
                return (
                  <React.Fragment key={index}>
                    <TableHead>Units Ordered</TableHead>
                    <TableHead>Sales</TableHead>
                    <TableHead>Sales Growth</TableHead>
                    <TableHead>Profit</TableHead>
                    <TableHead>Profit Growth</TableHead>
                  </React.Fragment>
                );
              })}
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <>
                {Array.from({ length: 5 }, (_, index) => {
                  const cellCount = 4 + 5 * comparedPeriods.length;
                  return (
                    <TableRow key={index} className="">
                      {Array.from({ length: cellCount }, (_, columnIndex) => (
                        <TableCell key={columnIndex}>
                          <span
                            className="placeholder w-100 rounded-2"
                            style={{ height: "30px" }}
                          ></span>
                        </TableCell>
                      ))}
                    </TableRow>
                  );
                })}
              </>
            ) : (
              <>
                {data?.items.map((product) => {
                  const sales = product?.sales;
                  const currencySymbol = getCurrencySymbol(
                    sales?.orderedProductSales.currencyCode
                  );

                  const totalSales = sales?.orderedProductSales.amount || 0;
                  const totalSpendings = product?.fees?.Amount || 0;
                  const totalProfit = totalSales - totalSpendings;
                  return (
                    <TableRow key={product.asin}>
                      <TableCell>
                        <span className="sale-product-text fw-bold text-1100">
                          {product.summary.itemName}
                        </span>
                      </TableCell>
                      <TableCell>{sales?.unitsOrdered ?? 0}</TableCell>
                      <TableCell>
                        <span className="text-nowrap">
                          {currencySymbol} {totalSales.toFixed(2)}
                        </span>
                      </TableCell>
                      <TableCell>
                        {currencySymbol} {totalProfit.toFixed(2)}
                      </TableCell>
                      {product.comparisons?.map((comparison, comIndex) => {
                        const compSales = comparison.sales;
                        const compTotalSales =
                          compSales.orderedProductSales.amount;
                        const compFees = comparison.fees.Amount;
                        const compProfit = compTotalSales - compFees;

                        const salesGrowth = calculatePercentage(
                          compTotalSales,
                          totalSales
                        );

                        const growth = calculatePercentage(
                          totalProfit,
                          compProfit
                        );

                        return (
                          <React.Fragment key={product.asin + comIndex}>
                            <TableCell>
                              {compSales?.unitsOrdered ?? 0}
                            </TableCell>
                            <TableCell>
                              <span className="text-nowrap">
                                {currencySymbol} {compTotalSales.toFixed(2)}
                              </span>
                            </TableCell>
                            <TableCell>{salesGrowth.toFixed(2)} %</TableCell>
                            <TableCell>
                              {currencySymbol} {compProfit.toFixed(2)}
                            </TableCell>
                            <TableCell>{growth.toFixed(2)} %</TableCell>
                          </React.Fragment>
                        );
                      })}
                    </TableRow>
                  );
                })}
              </>
            )}
          </TableBody>
        </Table>
      </div>
    </>
  );
}

export default SalesSummaryContainer;
