export type PriceAnalysis = {
  [label: string]: {
    highest: number;
    lowest: number;
    currency?: string;
  };
};
