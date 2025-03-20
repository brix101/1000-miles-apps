import { getCurrencySymbol } from "@/lib/utils";
import { OrderMetricsInterval } from "@repo/schema";

function useOrderMetricsCalculate(items: OrderMetricsInterval[] | undefined) {
  const totals = (items || []).reduce(
    (accumulator, currentValue) => {
      // Check if properties are defined before accumulating
      accumulator.unitCount += currentValue?.unitCount || 0;
      accumulator.orderItemCount += currentValue?.orderItemCount || 0;
      accumulator.orderCount += currentValue?.orderCount || 0;

      // Check if totalSales and its properties are defined before accumulating
      if (currentValue?.totalSales) {
        accumulator.totalSales.amount += currentValue.totalSales.amount || 0;
        accumulator.totalSales.currencyCode =
          currentValue.totalSales.currencyCode;
      }

      return accumulator;
    },
    {
      unitCount: 0,
      orderItemCount: 0,
      orderCount: 0,
      totalSales: { amount: 0, currencyCode: "" },
    }
  );

  const currencySymbol = getCurrencySymbol(totals?.totalSales.currencyCode);

  return { totals, currencySymbol };
}

export default useOrderMetricsCalculate;
