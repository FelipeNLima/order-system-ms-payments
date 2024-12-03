import { BadRequestException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { PrismaService } from '../../Infrastructure/Apis/prisma.service';
import { QRCodeService } from '../../Infrastructure/Apis/qrcode.service';
import { AwsSqsService } from '../../Infrastructure/Apis/sqs.service';
import { ConfirmPaymentEvent } from '../../Infrastructure/Events/confirmPaymentEvent';
import { PaymentEvents } from '../Enums/paymentStatus';
import { OrdersPayments } from '../Interfaces/orders';
import { Payments } from '../Interfaces/payments';
import { PaymentsRepository } from '../Repositories/paymentsRepository';
import { Status } from '../Enums/status';

@Injectable()
export class PaymentsAdapter implements PaymentsRepository {
  constructor(
    private readonly prisma: PrismaService,
    private readonly qrCode: QRCodeService,
    private readonly eventEmitter: EventEmitter2,
    private readonly sqsService: AwsSqsService,
    private readonly config: ConfigService,
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
      const response = await this.prisma.payments.update({
        where: {
          id: payments.id,
        },
        data: {
          ...payments,
        },
      });

      const returnOrder = {
        salesOrderID: response?.salesOrderID,
        orderID: response?.orderID,
        amount: response?.amount,
        payments: response?.status,
        orderTracking: Status.IN_PREPARATION,
      };

      // RETURN FOR QUEUE ORDER
      const queue = this.config.get<string>('QUEUE_SEND_ORDER');
      await this.sqsService.sendMessage(returnOrder, queue);

      return response;
    } catch (error) {
      const message = error?.meta?.target || error?.meta?.details;
      throw new BadRequestException(message);
    }
  }

  async createPayment(order: OrdersPayments): Promise<Payments | undefined> {
    try {
      const body = {
        description: `QRCODE-${order.customerID}-${new Date()}`,
        external_reference: String(order?.salesOrderID),
        title: 'Teste',
        total_amount: Number(order?.amount),
        cash_out: {
          amount: 0,
        },
        items: order?.items,
      };

      // CREATE QR-CODE
      const { data } = await this.qrCode.create(body);

      if (data) {
        const payments = {
          salesOrderID: String(order?.salesOrderID),
          qrCode: String(data?.qr_data),
          inStoreOrderID: String(data?.in_store_order_id),
          orderID: Number(order?.orderID),
          amount: Number(order?.amount),
        };

        const verifyIfExist = await this.prisma.payments.findUnique({
          where: { salesOrderID: String(payments?.salesOrderID) },
        });

        if (verifyIfExist) {
          throw new BadRequestException('Ordem de Pagamento já existe');
        }

        const response = await this.prisma.payments.create({
          data: { ...payments },
        });

        // WEBHOOK PARA CONFIRMAR PAGAMENTO
        if (response) {
          const payload = new ConfirmPaymentEvent({
            payload: response,
          });
          this.eventEmitter.emit(PaymentEvents.CONFIRM_PAYMENT, payload);
        }

        return response;
      }
    } catch (error) {
      const message =
        error?.message || error?.meta?.target || error?.meta?.details;
      throw new BadRequestException(message);
    }
  }
}
