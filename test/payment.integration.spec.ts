import { Test } from '@nestjs/testing';
import { randomUUID } from 'crypto';
import { PaymentsService } from 'src/Application/services/payments.service';
import { PaymentStatus } from 'src/Domain/Enums/paymentStatus';
import { OrdersPayments } from 'src/Domain/Interfaces/orders';
import { PrismaService } from 'src/Infrastructure/Apis/prisma.service';
import { QRCodeService } from 'src/Infrastructure/Apis/qrcode.service';
import { PaymentsModule } from 'src/Presentation/Payments/payments.module';

describe('TodoService Int', () => {
  let prisma: PrismaService;
  let service: PaymentsService;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [PaymentsModule],
      providers: [PaymentsService, QRCodeService],
    }).compile();

    prisma = moduleRef.get(PrismaService);
    service = moduleRef.get(PaymentsService);
    await prisma.payments.deleteMany();
  });

  describe('createTodo()', () => {
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
          quantity: 1,
          unit_measure: 'unit',
          total_amount: 1 * 5,
        },
      ],
    };
    it('should create payment', async () => {
      const payment = await service.create(dto);
      expect(payment?.orderID).toBe(dto.orderID);
      expect(payment?.salesOrderID).toBe(dto.salesOrderID);
      expect(payment?.status).toBe(PaymentStatus.PENDING);
    });
  });
});
