import { OrdersPayments } from '../Interfaces/orders';
import { Payments } from '../Interfaces/payments';

export abstract class PaymentsRepository {
  abstract getPaymentsById(id: number): Promise<Payments | null>;
  abstract getPaymentsByOrderId(orderID: number): Promise<Payments | null>;
  abstract createPayment(order: OrdersPayments): Promise<Payments | undefined>;
  abstract updatePayment(payment: Payments): Promise<Payments>;
}
