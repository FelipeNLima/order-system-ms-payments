import { Injectable } from '@nestjs/common';
import { OrdersPayments } from '../../Domain/Interfaces/orders';
import { Payments } from '../../Domain/Interfaces/payments';
import { PaymentsRepository } from '../../Domain/Repositories/paymentsRepository';

@Injectable()
export class PaymentsService {
  constructor(private readonly paymentsRepository: PaymentsRepository) {}

  async getById(id: number): Promise<Payments | null> {
    return this.paymentsRepository.getPaymentsById(id);
  }
  async getPaymentsByOrderId(orderID: number): Promise<Payments | null> {
    return this.paymentsRepository.getPaymentsByOrderId(orderID);
  }
  async create(order: OrdersPayments): Promise<Payments | undefined> {
    return this.paymentsRepository.createPayment(order);
  }
  async update(payment: Payments): Promise<Payments> {
    return this.paymentsRepository.updatePayment(payment);
  }
}
