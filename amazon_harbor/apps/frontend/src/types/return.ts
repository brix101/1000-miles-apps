export interface ReturnData {
  totalReturns: {
    amount: number;
    currencyCode: string;
  };
  totalUnits: number;
  totalRefundRate: number;
}

export interface ReturnComparison {
  value: string;
  returns: ReturnData;
}

export interface ReturnDataResult {
  returns: ReturnData;
  comparisons: ReturnComparison[];
}
