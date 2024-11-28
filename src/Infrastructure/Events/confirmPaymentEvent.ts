export class ConfirmPaymentEvent {
  payload: {
    salesOrderID: string;
    inStoreOrderID: string;
    qrCode: string;
    id: number;
    orderID: number;
    amount: number;
    status: string;
  };

  constructor({
    payload,
  }: {
    payload: {
      salesOrderID: string;
      inStoreOrderID: string;
      qrCode: string;
      id: number;
      orderID: number;
      amount: number;
      status: string;
    };
  }) {
    this.payload = payload;
  }
}
