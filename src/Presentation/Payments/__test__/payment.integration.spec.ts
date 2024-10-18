import { HttpModule } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { Test, TestingModule } from '@nestjs/testing';
import { randomUUID } from 'crypto';
import { PaymentsService } from '../../../Application/services/payments.service';
import { PaymentsAdapter } from '../../../Domain/Adapters/payments.adapter';
import { OrdersPayments } from '../../../Domain/Interfaces/orders';
import { PaymentsRepository } from '../../../Domain/Repositories/paymentsRepository';
import { PrismaService } from '../../../Infrastructure/Apis/prisma.service';
import { QRCodeService } from '../../../Infrastructure/Apis/qrcode.service';
import { ConfirmPaymentListener } from '../../../Infrastructure/Events/listeners/confirmPayment.listener';
import { PaymentsController } from '../payments.controller';

describe('Payments', () => {
  let service: PaymentsService;
  let prisma: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [HttpModule],
      controllers: [PaymentsController],
      providers: [
        PaymentsService,
        PrismaService,
        QRCodeService,
        ConfigService,
        ConfirmPaymentListener,
        EventEmitter2,
        { provide: PaymentsRepository, useClass: PaymentsAdapter },
      ],
    })
      .overrideProvider(PrismaService)
      .useValue(PrismaService)
      .compile();

    service = module.get(PaymentsService);
    prisma = module.get(PrismaService);
  });

  it('should payments', async () => {
    try {
      const dto: OrdersPayments = {
        salesOrderID: randomUUID(),
        customerID: '1',
        orderID: 1,
        amount: 10,
        items: [
          {
            sku_number: '100000',
            category: 'marketplace',
            title: 'x-burger',
            unit_price: 10,
            quantity: 1,
            unit_measure: 'unit',
            total_amount: 10,
          },
        ],
      };
      const createResult = await service.create(dto);

      const result = await prisma.payments.findFirst({
        where: { orderID: dto?.orderID },
      });

      // Log the results
      console.log(result);

      // Assert the create result
      expect(createResult).toEqual(result);
    } catch (error) {
      throw error;
    }
  });
});
