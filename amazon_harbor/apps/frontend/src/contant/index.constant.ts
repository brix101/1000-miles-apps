export const productStatuses = ["All", "Active", "Inactive"];

export const defaultBrand = "BSCOOL";
export const defaultMarketplace = "ATVPDKIKX0DER";
export const defaultProductStatus = productStatuses[1];

export const salesPeriods = [
  { value: "YESTERDAY", label: "Yesterday" },
  { value: "WEEK", label: "This Week" },
  { value: "MONTH", label: "This Month" },
  { value: "QUARTER", label: "This Quarter" },
  { value: "FINANCIAL_YEAR", label: "This Financial year" },
  { value: "CUSTOM_PERIOD", label: "Custom Dates" },
];

export const defaultSalesPeriod = salesPeriods[0].value;

export const comparisonPeriods = [
  { value: "LAST_WEEK", label: "Same Period Last Week" },
  { value: "LAST_MONTH", label: "Same Period Last Month" },
  { value: "LAST_YEAR", label: "Same Period Last Year" },
  { value: "CUSTOM_COMPARISON", label: "Custom Period" },
];

export const defaultComparisonPeriod = comparisonPeriods[0].value;

export const campaignStatuses = ["Active", "Inactive"];
export const defaultCampaignStatus = campaignStatuses[0];
