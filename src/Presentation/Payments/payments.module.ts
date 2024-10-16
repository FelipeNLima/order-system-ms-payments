import { Module } from '@nestjs/common';

import { HttpModule } from '@nestjs/axios';
import { QRCodeService } from 'src/Infrastructure/Apis/qrcode.service';
import { PaymentsService } from '../../Application/services/payments.service';
import { PaymentsAdapter } from '../../Domain/Adapters/payments.adapter';
import { PaymentsRepository } from '../../Domain/Repositories/paymentsRepository';
import { PrismaService } from '../../Infrastructure/Apis/prisma.service';
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
    ConfirmPaymentListener,
  ],
})
export class PaymentsModule {}
