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
import useBoundStore from "@/hooks/useBoundStore";
import {
  calculatePercentage,
  getCurrencySymbol,
  getImages,
  getPeriodDates,
} from "@/lib/utils";
import { ISalesOrderMetricQuery } from "@/services/sale.service";
import React from "react";
import SalesGraphViewModal from "../forms/SalesGraphViewModal";
import { Button } from "../ui/button";

interface SalesByProductsContainerProps {
  query: ISalesOrderMetricQuery;
}

function SalesByProductsContainer({ query }: SalesByProductsContainerProps) {
  const setDialogItem = useBoundStore((state) => state.setDialogItem);
  const { data, isLoading } = useGetSalesAndTrafficByProduct(query);

  const comparedPeriods = data?.comparedPeriods || [];
  const currentPeriod = data?.currentPeriod;

  const periodLabel = salesPeriods.find(
    (item) => item.value === currentPeriod?.value
  )?.label;
  const { startDate, endDate } = getPeriodDates(currentPeriod);
  return (
    <>
      <div className="d-flex justify-content-between align-items-center">
        <p className="text-700 lead">Sales By Product</p>
        <div>
          <Button
            disabled={isLoading}
            variant="success"
            size="sm"
            onClick={() =>
              setDialogItem({
                item: <SalesGraphViewModal query={query} />,
                size: "xl",
              })
            }
          >
            See All
          </Button>
        </div>
      </div>
      <div className="mt-5 mx-n4 mx-lg-n6 px-4 px-lg-6 mb-9 bg-white border-y border-300 mt-2 position-relative top-1  placeholder-glow">
        <Table>
          <colgroup span={3} />
          <colgroup span={4} className="bg-light" />
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
              <TableHead colSpan={3}></TableHead>
              <TableHead colSpan={4}>
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
                const compLabel = comparisonPeriods.find(
                  (item) => item.value === period.value
                )?.label;

                const { startDate: compStartDate, endDate: compEndDate } =
                  getPeriodDates(period);

                return (
                  <TableHead key={index} colSpan={5} className="text-nowrap">
                    {isLoading ? (
                      <span
                        className="placeholder w-100 rounded-2"
                        style={{ height: "20px" }}
                      />
                    ) : (
                      <>
                        {compLabel ? (
                          <>
                            {compLabel} ({compStartDate} to {compEndDate})
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
              <TableHead>Image</TableHead>
              <TableHead>Product Name</TableHead>
              <TableHead>Brand</TableHead>
              <TableHead>Units Ordered</TableHead>
              <TableHead>Sales</TableHead>
              <TableHead>Spending</TableHead>
              <TableHead>Profit</TableHead>

              {comparedPeriods.map((_, index) => {
                return (
                  <React.Fragment key={index}>
                    <TableHead>Growth</TableHead>
                    <TableHead>Units Ordered</TableHead>
                    <TableHead>Sales</TableHead>
                    <TableHead>Spending</TableHead>
                    <TableHead>Profit</TableHead>
                  </React.Fragment>
                );
              })}
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <>
                {Array.from({ length: 5 }, (_, index) => {
                  const cellCount = 6 + 5 * comparedPeriods.length;
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
                {data?.items.slice(0, 5).map((product) => {
                  const sales = product?.sales;
                  const currencySymbol = getCurrencySymbol(
                    sales?.orderedProductSales.currencyCode
                  );

                  const image = getImages({
                    images: product.images || [],
                  })?.[0];

                  const totalSales = sales?.orderedProductSales.amount || 0;
                  const totalFees = product?.fees?.Amount || 0;
                  const totalProfit = totalSales - totalFees;

                  return (
                    <TableRow key={product.asin}>
                      <TableCell>
                        <div className="avatar avatar-xl">
                          <img
                            src={image?.link}
                            alt={"mmaries.marketplaceId"}
                          />
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className="sale-product-text fw-bold text-1100">
                          {product.summary.itemName}
                        </span>
                      </TableCell>
                      <TableCell className="text-uppercase">
                        {product.summary.brand}
                      </TableCell>
                      <TableCell>{sales?.unitsOrdered ?? 0}</TableCell>
                      <TableCell>
                        <span className="text-nowrap">
                          {currencySymbol} {totalSales.toFixed(2)}
                        </span>
                      </TableCell>
                      <TableCell>
                        {currencySymbol} {totalFees.toFixed(2)}
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

                        const growth = calculatePercentage(
                          totalSales,
                          compTotalSales
                        );

                        return (
                          <React.Fragment key={product.asin + comIndex}>
                            <TableCell>{growth.toFixed(2)} %</TableCell>
                            <TableCell>
                              {compSales?.unitsOrdered ?? 0}
                            </TableCell>
                            <TableCell>
                              <span className="text-nowrap">
                                {currencySymbol} {compTotalSales.toFixed(2)}
                              </span>
                            </TableCell>
                            <TableCell>
                              {currencySymbol} {compFees.toFixed(2)}
                            </TableCell>
                            <TableCell>
                              {currencySymbol} {compProfit.toFixed(2)}
                            </TableCell>
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

export default SalesByProductsContainer;
