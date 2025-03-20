export interface MoneyType {
  CurrencyCode: string;
  Amount: number;
}

export interface FeesEstimate {
  TimeOfFeesEstimation: string;
  MoneyType: MoneyType;
}
