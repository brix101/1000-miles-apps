export interface ProcurementIssue {
  code: string;
  message: string;
  severity: string;
  attributeNames: string[];
  categories: string[];
  enforcements: {
    actions: {
      action: string;
    }[];
    exemption: {
      status: string;
    };
  };
}
