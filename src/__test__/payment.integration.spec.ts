import { HttpModule } from '@nestjs/axios';
import { INestApplication } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { Test, TestingModule } from '@nestjs/testing';
import { MySqlContainer, StartedMySqlContainer } from '@testcontainers/mysql';
import { execSync } from 'child_process';
import { randomUUID } from 'crypto';
import { Connection, createConnection } from 'mysql2';
import request from 'supertest';
import { PrismaClient } from '../../prisma/generated';
import { PaymentsService } from '../Application/services/payments.service';
import { PaymentsAdapter } from '../Domain/Adapters/payments.adapter';
import { PaymentEvents } from '../Domain/Enums/paymentStatus';
import { OrdersPayments } from '../Domain/Interfaces/orders';
import { PaymentsRepository } from '../Domain/Repositories/paymentsRepository';
import { PrismaService } from '../Infrastructure/Apis/prisma.service';
import { QRCodeService } from '../Infrastructure/Apis/qrcode.service';
import { AwsSqsService } from '../Infrastructure/Apis/sqs.service';
import { ConfirmPaymentEvent } from '../Infrastructure/Events/confirmPaymentEvent';
import { HealthController } from '../Presentation/Health/health.controller';
import { PrismaHealthIndicator } from '../Presentation/Health/PrismaHealthIndicator.service';
import { PaymentsController } from '../Presentation/Payments/payments.controller';

let container: StartedMySqlContainer; // importamos do pacote testcontainers/mysql
let prismaClient: PrismaClient; // importamos do Prisma Client
let app: INestApplication; // importamos nestjs common
let urlConnection: string; // a url do banco que sera criada pelo testcontainers
let client: Connection; // importamos do pacote mysql
let controller: PaymentsController; // controller
let eventEmitter: EventEmitter2; // controller

beforeAll(async () => {
  jest.setTimeout(5000);
  container = await new MySqlContainer().start();
  client = createConnection({
    host: container.getHost(),
    port: container.getPort(),
    user: container.getUsername(),
    password: container.getRootPassword(),
    database: container.getDatabase(),
    connectTimeout: 2000000,
  });

  client.connect();
  process.env.DATABASE_URL = container.getConnectionUri();
  urlConnection = process.env.DATABASE_URL;

  // create a new instance of PrismaClient with the connection string
  prismaClient = new PrismaClient({
    datasources: {
      db: {
        url: urlConnection,
      },
    },
  });

  // start the nestjs application
  const module: TestingModule = await Test.createTestingModule({
    imports: [HttpModule],
    controllers: [PaymentsController, HealthController],
    providers: [
      PrismaHealthIndicator,
      PaymentsService,
      PrismaService,
      ConfigService,
      QRCodeService,
      AwsSqsService,
      EventEmitter2,
      { provide: PaymentsRepository, useClass: PaymentsAdapter },
    ],
  }).compile();

  eventEmitter = module.get<EventEmitter2>(EventEmitter2);
  controller = module.get<PaymentsController>(PaymentsController);
  app = module.createNestApplication();
  await app.init();
});

afterAll(async () => {
  await prismaClient.$disconnect();
  client.destroy();
  await container.stop();
});

beforeEach(async () => {
  // drop schema and create a new one
  execSync(`npx prisma migrate reset --force`, {
    env: {
      ...process.env,
      DATABASE_URL: urlConnection,
    },
  });
  execSync(`npx prisma migrate deploy`, {
    env: {
      ...process.env,
      DATABASE_URL: urlConnection,
    },
  });
});

afterEach(() => {
  jest.restoreAllMocks();
});

describe('Integration Test Payments', () => {
  it('should create payment', async () => {
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
          total_amount: 10,
        },
      ],
    };

    await request(app.getHttpServer()).post('/payments').send(dto).expect(201);

    const paymentDb = await controller.getByID(1);

    expect(paymentDb).toBeTruthy();
    expect(paymentDb?.salesOrderID).toBe(dto.salesOrderID);
    expect(paymentDb?.orderID).toBe(dto.orderID);
  });

  // it('should update payment', async () => {
  //   const dto: OrdersPayments = {
  //     salesOrderID: randomUUID(),
  //     customerID: '1',
  //     orderID: 1,
  //     amount: 10,
  //     items: [
  //       {
  //         sku_number: '100000',
  //         category: 'marketplace',
  //         title: 'x-burger',
  //         unit_price: 5,
  //         quantity: 2,
  //         unit_measure: 'unit',
  //         total_amount: 10,
  //       },
  //     ],
  //   };

  //   await request(app.getHttpServer()).post('/payments').send(dto).expect(201);

  //   const payments = {
  //     id: 1,
  //     createdAt: new Date('2024-10-17T22:38:38.430Z'),
  //     updatedAt: new Date('2024-10-17T22:38:38.430Z'),
  //     salesOrderID: '5ace7194-247b-4c4a-a7a5-1018cd092bb0',
  //     inStoreOrderID: '6b800cf5-e752-4de0-b092-89378a84c6a5',
  //     qrCode:
  //       '00020101021243650016COM.MERCADOLIBRE0201306366b800cf5-e752-4de0-b092-89378a84c6a55204000053039865802BR5911felipe lima6009SAO PAULO62070503***6304B5CA',
  //     orderID: 1,
  //     amount: 10,
  //     status: 'PAID',
  //   };

  //   await request(app.getHttpServer())
  //     .patch('/payments')
  //     .send(payments)
  //     .expect(200);

  //   const paymentDb = await prismaClient.payments.findUnique({
  //     where: {
  //       id: 1,
  //     },
  //   });

  //   expect(paymentDb).toBeTruthy();
  //   expect(paymentDb?.status).toBe(payments.status);
  // });

  it('should Get payments by id', async () => {
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
          total_amount: 10,
        },
      ],
    };

    await request(app.getHttpServer()).post('/payments').send(dto).expect(201);

    const id = 1;

    await request(app.getHttpServer()).get(`/payments/${id}`).expect(200);

    const paymentDb = await prismaClient.payments.findUnique({
      where: {
        id: 1,
      },
    });

    expect(paymentDb).toBeTruthy();
    expect(paymentDb?.id).toBe(id);
  });

  it('should Get payments by orderID', async () => {
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
          total_amount: 10,
        },
      ],
    };

    await request(app.getHttpServer()).post('/payments').send(dto).expect(201);

    const orderID = 1;

    const paymentDb = await controller.getPaymentsByOrderId(dto?.orderID);
    expect(paymentDb?.orderID).toBe(orderID);
  });

  it('should event Payments', async () => {
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
          total_amount: 10,
        },
      ],
    };

    const response = await request(app.getHttpServer())
      .post('/payments')
      .send(dto)
      .expect(201);

    const payload = new ConfirmPaymentEvent({
      payload: response.body,
    });

    eventEmitter.emit(PaymentEvents.CONFIRM_PAYMENT, payload);
  });
});

afterAll(async () => {
  await prismaClient.$disconnect();
  await container.stop();
  client.destroy();
});
