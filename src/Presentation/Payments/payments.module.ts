import { Module } from '@nestjs/common';

import { HttpModule } from '@nestjs/axios';
import { ConfirmPaymentListener } from 'src/Infrastructure/Events/listeners/confirmPayment.listener';
import { ConsumerService } from 'src/Infrastructure/RabbitMQ/rabbitMQ.service';
import { PaymentsService } from '../../Application/services/payments.service';
import { PaymentsAdapter } from '../../Domain/Adapters/payments.adapter';
import { PaymentsRepository } from '../../Domain/Repositories/paymentsRepository';
import { PrismaService } from '../../Infrastructure/Apis/prisma.service';
import { QRCodeService } from '../../Infrastructure/Apis/qrcode.service';
import { PaymentsController } from './payments.controller';

@Module({
  imports: [HttpModule],
  controllers: [PaymentsController],
  providers: [
    { provide: PaymentsRepository, useClass: PaymentsAdapter },
    PaymentsService,
    PrismaService,
    QRCodeService,
    ConsumerService,
    ConfirmPaymentListener,
  ],
})
export class PaymentsModule {}
