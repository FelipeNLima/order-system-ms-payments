import { BadRequestException, Injectable } from '@nestjs/common';
import { QRCodeService } from 'src/Infrastructure/Apis/qrcode.service';
import { PrismaService } from '../../Infrastructure/Apis/prisma.service';
import { OrdersPayments } from '../Interfaces/orders';
import { Payments } from '../Interfaces/payments';
import { PaymentsRepository } from '../Repositories/paymentsRepository';

@Injectable()
export class PaymentsAdapter implements PaymentsRepository {
  constructor(
    private prisma: PrismaService,
    private qrCode: QRCodeService,
  ) {}

  async getPaymentsById(id: number): Promise<Payments | null> {
    try {
      return await this.prisma.payments.findUnique({ where: { id } });
    } catch (error) {
      const message = error?.meta?.target || error?.meta?.details;
      throw new Error(message);
    }
  }

  async getPaymentsByOrderId(orderID: number): Promise<Payments | null> {
    try {
      return await this.prisma.payments.findFirst({
        where: { orderID: orderID },
      });
    } catch (error) {
      const message = error?.meta?.target || error?.meta?.details;
      throw new Error(message);
    }
  }

  async updatePayment(payments: Payments): Promise<Payments> {
    try {
      return await this.prisma.payments.update({
        where: {
          id: payments.id,
        },
        data: {
          ...payments,
        },
      });
    } catch (error) {
      const message = error?.meta?.target || error?.meta?.details;
      throw new BadRequestException(message);
    }
  }

  async createPayment(order: OrdersPayments): Promise<Payments | undefined> {
    try {
      const body = {
        description: `QRCODE-${order.customerID}-${new Date()}`,
        external_reference: order?.salesOrderID,
        title: 'OrderSystem',
        total_amount: order?.amount,
        cash_out: {
          amount: 0,
        },
        items: order?.items,
      };

      // CREATE QR-CODE
      const { data } = await this.qrCode.create(body);

      if (data) {
        const payments = {
          salesOrderID: order?.salesOrderID,
          qrCode: data?.qr_data,
          inStoreOrderID: data?.in_store_order_id,
          orderID: order?.orderID,
        };

        return await this.prisma.payments.create({
          data: {
            ...payments,
          },
        });
      }
    } catch (error) {
      const message = error?.meta?.target || error?.meta?.details;
      throw new BadRequestException(message);
    }
  }
}
