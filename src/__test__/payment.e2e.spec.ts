import { HttpModule } from '@nestjs/axios';
import { INestApplication } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { Test, TestingModule } from '@nestjs/testing';
import { PrismaHealthIndicator } from 'src/Presentation/Health/PrismaHealthIndicator.service';
import { PaymentsService } from '../Application/services/payments.service';
import { PaymentsAdapter } from '../Domain/Adapters/payments.adapter';
import { PaymentsRepository } from '../Domain/Repositories/paymentsRepository';
import { PrismaService } from '../Infrastructure/Apis/prisma.service';
import { QRCodeService } from '../Infrastructure/Apis/qrcode.service';
import { ConfirmPaymentListener } from '../Infrastructure/Events/listeners/confirmPayment.listener';
import { HealthController } from '../Presentation/Health/health.controller';
import { PaymentsController } from '../Presentation/Payments/payments.controller';

describe('E2E Test Payments', () => {
  let paymentController: PaymentsController;
  let healthController: HealthController;
  let service: PaymentsService;
  let prisma: PrismaService;
  let healthService: PrismaHealthIndicator;
  let app: INestApplication;

  const mockTodoService = {
    getById: jest.fn(),
    getPaymentsByOrderId: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    markAsInActive: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [HttpModule],
      controllers: [PaymentsController, HealthController],
      providers: [
        PrismaHealthIndicator,
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
      .useValue(mockTodoService)
      .compile();

    paymentController = module.get<PaymentsController>(PaymentsController);
    healthController = module.get<HealthController>(HealthController);
    service = module.get(PaymentsService);
    healthService = module.get(PrismaHealthIndicator);
    prisma = module.get(PrismaService);
    app = module.createNestApplication();
    await app.init();
  });

  it('should be defined', () => {
    expect(paymentController).toBeDefined();
    expect(service).toBeDefined();
    expect(prisma).toBeDefined();
    expect(healthController).toBeDefined();
    expect(healthService).toBeDefined();
  });
});
