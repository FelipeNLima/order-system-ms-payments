import { Module } from '@nestjs/common';

import { HttpModule } from '@nestjs/axios';
import { PaymentsService } from '../../Application/services/payments.service';
import { PaymentsAdapter } from '../../Domain/Adapters/payments.adapter';
import { PaymentsRepository } from '../../Domain/Repositories/paymentsRepository';
import { ConsumerService } from '../../Infrastructure/Apis/consumer.service';
import { PrismaService } from '../../Infrastructure/Apis/prisma.service';
import { QRCodeService } from '../../Infrastructure/Apis/qrcode.service';
import { AwsSqsService } from '../../Infrastructure/Apis/sqs.service';
import { ConfirmPaymentListener } from '../../Infrastructure/Events/listeners/confirmPayment.listener';
import { PaymentsController } from './payments.controller';

@Module({
  imports: [HttpModule],
  controllers: [PaymentsController],
  providers: [
    { provide: PaymentsRepository, useClass: PaymentsAdapter },
    PaymentsService,
    PrismaService,
    QRCodeService,
    //ConsumerService,
    //AwsSqsService,
    ConfirmPaymentListener,
  ],
})
export class PaymentsModule {}
