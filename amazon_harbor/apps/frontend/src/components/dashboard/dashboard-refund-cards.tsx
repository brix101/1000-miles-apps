import {
  defaultComparisonPeriod,
  defaultMarketplace,
} from "@/contant/index.constant";
import useGetReturn from "@/hooks/queries/useGetReturn";
import useCreateQuery from "@/hooks/useCreateQuery";
import { getCurrencySymbol } from "@/lib/utils";
import { ISalesOrderMetricQuery } from "@/services/sale.service";
import { defaultQueryInterval } from "../search-select/date-range-search-select";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";

export default function DashboardRefundCards() {
  const [query] = useCreateQuery<ISalesOrderMetricQuery>({
    marketplace: defaultMarketplace,
    period: "CUSTOM_PERIOD",
    interval: defaultQueryInterval,
    comparisonPeriod: defaultComparisonPeriod,
  });

  const { data, isLoading } = useGetReturn(query);

  const refurnRate = data?.returns.totalRefundRate || 0;
  const totalUnits = data?.returns.totalUnits || 0;
  const refundAmount = data?.returns.totalReturns.amount || 0;
  const currencySymbol = getCurrencySymbol(
    data?.returns.totalReturns.currencyCode
  );
  return (
    <>
      <Card className="grid-item">
        <CardHeader className="align-items-center justify-content-between">
          <CardTitle>Return Rate</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="d-flex flex-column align-items-center justify-content-between  text-nowrap">
            <>
              {isLoading ? (
                <span className="placeholder placeholder-dashboard m-1 w-25 rounded-2" />
              ) : (
                <h3
                  className={`fw-bolder text-nowrap ${refurnRate > 0 ? "text-danger" : "text-success"}`}
                >
                  {refurnRate} %
                </h3>
              )}
            </>
          </div>
        </CardContent>
      </Card>
      <Card className="grid-item">
        <CardHeader className="align-items-center justify-content-between">
          <CardTitle>Refund Amount</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="d-flex flex-column align-items-center justify-content-between  text-nowrap">
            <>
              {isLoading ? (
                <span className="placeholder placeholder-dashboard m-1 w-25 rounded-2" />
              ) : (
                <h3
                  className={`fw-bolder text-nowrap ${refundAmount > 0 ? "text-danger" : "text-success"}`}
                >
                  {currencySymbol} {refundAmount.toFixed(2)}
                </h3>
              )}
            </>
          </div>
        </CardContent>
      </Card>
      <Card className="grid-item">
        <CardHeader className="align-items-center justify-content-between">
          <CardTitle>Refund Quantity</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="d-flex flex-column align-items-center justify-content-between  text-nowrap">
            <>
              {isLoading ? (
                <span className="placeholder placeholder-dashboard m-1 w-25 rounded-2" />
              ) : (
                <h3 className="fw-bolder text-nowrap ">{totalUnits}</h3>
              )}
            </>
          </div>
        </CardContent>
      </Card>
    </>
  );
}
