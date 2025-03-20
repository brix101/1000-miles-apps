import { SalesOrder } from "./salesOrder";

export interface Group {
  _id: string;
  name: string;
  customerIds: number[];
  createdAt: Date;
  updatedAt: Date;
}

export interface GroupSalesOrder extends Group {
  salesOrders: SalesOrder[];
}
