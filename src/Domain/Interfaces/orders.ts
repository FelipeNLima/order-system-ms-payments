export interface items {
  sku_number: string;
  category: string;
  title: string;
  unit_price: number;
  quantity: number;
  unit_measure: string;
  total_amount: number;
}

export interface OrdersPayments {
  salesOrderID: string;
  customerID: string;
  orderID: number;
  amount: number;
  items: items[];
}
