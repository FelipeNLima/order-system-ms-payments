export interface Payments {
  createdAt?: Date;
  updatedAt?: Date;
  salesOrderID: string;
  inStoreOrderID: string;
  qrCode: string;
  id: number;
  orderID: number;
  amount: number;
  status: string;
}
