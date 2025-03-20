import SalesPeriodContainer from "@/components/container/sales-period-container";
import { Button } from "@/components/ui/button";
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
import Modal from "react-bootstrap/Modal";
import SalesReportButton from "../report-sales-button";

interface SalesGraphViewModal {
  query: ISalesOrderMetricQuery;
}

function SalesGraphViewModal({ query }: SalesGraphViewModal) {
  const closeDialog = useBoundStore((state) => state.closeDialog);

  const { data, isLoading } = useGetSalesAndTrafficByProduct(query);
  const comparedPeriods = data?.comparedPeriods || [];
  const currentPeriod = data?.currentPeriod;

  const periodLabel = salesPeriods.find(
    (item) => item.value === currentPeriod?.value
  )?.label;
  const { startDate, endDate } = getPeriodDates(currentPeriod);

  const detailGroup = 3;

  return (
    <>
      <Modal.Header closeButton>
        <div className="custom-modal-title"></div>
      </Modal.Header>
      <Modal.Body>
        <p className="text-700 lead mb-2 mt-4">Period Overview</p>
        <div className="container row mb-4 mt-4">
          <SalesPeriodContainer query={query} />
        </div>
        <Table>
          <colgroup span={detailGroup} />
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
              <TableHead colSpan={detailGroup}></TableHead>
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
                {data?.items.map((product) => {
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
      </Modal.Body>
      <Modal.Footer>
        <SalesReportButton query={query} />
        <Button variant="outline-secondary" onClick={closeDialog}>
          Back
        </Button>
      </Modal.Footer>
    </>
  );
}

export default SalesGraphViewModal;
