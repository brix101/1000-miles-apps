import { currencySymbols } from "@/contant/currency.contant";
import { unitAbbreviations } from "@/contant/unit.constant";
import { Dimension } from "@/types";
import { ItemDimensions } from "@/types/listing-product";
import { Image, ItemPackageWeight } from "@repo/schema";
import { clsx, type ClassValue } from "clsx";
import dayjs from "dayjs";

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}

export function getDimension(item: ItemDimensions | null): Dimension {
  return {
    length: item?.length?.value || 0,
    width: item?.width?.value || 0,
    height: item?.height?.value || 0,
    unit: unitAbbreviations[
      item?.length?.unit || item?.width?.unit || item?.height?.unit || ""
    ],
  };
}

export function getDimensionString(item: ItemDimensions | null): string {
  const { length, width, height, unit } = getDimension(item);
  return `${length.toFixed(2)} x ${width.toFixed(2)} x ${height.toFixed(2)} ${unit}`;
}

export function getDimensionStringConverted(
  item: ItemDimensions | null,
  to: "in" | "cm"
): string {
  if (!item) return "";

  const { length, width, height, unit } = getDimension(item);

  if (to === unit) {
    return `${length.toFixed(2)} x ${width.toFixed(2)} x ${height.toFixed(2)} ${unit}`;
  }

  const conversionFactor = to === "in" ? 1 / 2.54 : 2.54;
  const dimensionsInTargetUnit = {
    length: length * conversionFactor,
    width: width * conversionFactor,
    height: height * conversionFactor,
  };

  return `${dimensionsInTargetUnit.length.toFixed(2)} x ${dimensionsInTargetUnit.width.toFixed(2)} x ${dimensionsInTargetUnit.height.toFixed(2)} ${to}`;
}

export function getVolumeItems(item: ItemDimensions | null): {
  cbm: number;
  cuft: number;
  cuin: number;
} {
  const { length, width, height } = getDimension(item);

  const cbm = length * width * height * 0.000001;
  const cuft = cbm * 35.315;
  const cuin = cbm * 61023.7;

  return { cbm, cuft, cuin };
}

export function getImages<
  T extends {
    images: Image[];
  },
>(item: T, variant?: string) {
  const defaultVariant = variant ?? "MAIN";
  const images = item.images[0].images;

  const filteredImages = images.filter((img) => img.variant === defaultVariant);

  const sortedImages = filteredImages.sort((a, b) => {
    // Assuming width and height are numeric properties
    const areaA = a.width * a.height;
    const areaB = b.width * b.height;

    return areaB - areaA;
  });

  return sortedImages;
}

export function getWeight<
  T extends { attributes: { item_package_weight?: ItemPackageWeight[] } },
>(item: T): { value: number; unit?: string } {
  const weight = item.attributes?.item_package_weight?.[0];
  const unitMapping: Record<string, string> = {
    centimeters: "cm",
    kilograms: "kg",
    pounds: "lb", // Shorthand for pounds
  };

  return weight
    ? { value: weight.value, unit: unitMapping[weight.unit] || weight.unit }
    : { value: 0, unit: "" };
}

export function getModelName<
  T extends { attributes: { model_name?: { value: string }[] } },
>(item: T): string {
  const modelName =
    (item.attributes.model_name && item.attributes.model_name[0].value) ?? "";

  return modelName;
}

export function getCurrencySymbol(currencyCode?: string): string {
  if (!currencyCode) return "";

  return currencySymbols[currencyCode] || currencyCode;
}

export function createObjectParams<T extends {}>(
  query: T
): Record<string, string> {
  const params: Record<string, string> = Object.fromEntries(
    Object.entries(query)
      .filter(([_, value]) => value !== undefined && value !== null)
      .map(([key, value]) => [key, String(value)])
  );

  return params;
}

export function calculatePercentage(prev: number, curr: number): number {
  // Check if previousSales is not zero to avoid division by zero
  if (prev !== 0) {
    return ((curr - prev) / Math.abs(prev)) * 100;
  } else {
    // Handle the case where previousSales is zero to avoid division by zero
    return 0;
  }
}

export function getPeriodDates(period) {
  if (!period) {
    return { startDate: "", endDate: "" };
  }

  const { start, end } = period;
  const startDate = dayjs(start).format("MMM-DD, YYYY");
  const endDate = dayjs(end).format("MMM-DD, YYYY");

  return { startDate, endDate };
}
