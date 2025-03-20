import { Assortment } from "@/types/assortment";

export interface UccBarcode {
  masterUccLabel?: string | null;
  innerUccLabel?: string | null;
}

export function getBarcodes(assortment?: Assortment): UccBarcode {
  if (!assortment) {
    return {
      masterUccLabel: undefined,
      innerUccLabel: undefined,
    };
  }

  const labels = assortment.labels?.find((label) =>
    label.hasOwnProperty("unit")
  );

  const unitVal = assortment.unit || labels?.["unit"].value || "PR";
  const mCount = assortment.itemInCarton || assortment.productInCarton || 0;
  const iCount = assortment.itemPerUnit || assortment.productPerUnit || 0;

  const masterBarcode = `${assortment.customerItemNo} ${mCount} ${unitVal}`;
  const innerBarcode = `${assortment.customerItemNo} ${iCount} ${unitVal}`;

  return {
    masterUccLabel: mCount ? masterBarcode : null,
    innerUccLabel: iCount ? innerBarcode : null,
  };
}
