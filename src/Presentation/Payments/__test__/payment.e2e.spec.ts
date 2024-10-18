import { HttpModule } from '@nestjs/axios';
import { INestApplication } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { Test, TestingModule } from '@nestjs/testing';
import { randomUUID } from 'crypto';
import request from 'supertest';
import { PaymentsService } from '../../../Application/services/payments.service';
import { PaymentsAdapter } from '../../../Domain/Adapters/payments.adapter';
import { OrdersPayments } from '../../../Domain/Interfaces/orders';
import { PaymentsRepository } from '../../../Domain/Repositories/paymentsRepository';
import { PrismaService } from '../../../Infrastructure/Apis/prisma.service';
import { QRCodeService } from '../../../Infrastructure/Apis/qrcode.service';
import { ConfirmPaymentListener } from '../../../Infrastructure/Events/listeners/confirmPayment.listener';
import { PaymentsController } from '../payments.controller';

describe('Payments E2E', () => {
  let controller: PaymentsController;
  let app: INestApplication;

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

    controller = module.get<PaymentsController>(PaymentsController);
    app = module.createNestApplication();
    await app.init();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should create payments', async () => {
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
          unit_price: 5,
          quantity: 2,
          unit_measure: 'unit',
          total_amount: 2 * 5,
        },
      ],
    };

    const response = await request(app.getHttpServer())
      .post('/payments')
      .send(dto)
      .expect(404);

    expect(response.body).toEqual(response);
  });
});
