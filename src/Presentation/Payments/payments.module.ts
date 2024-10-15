import { Module } from '@nestjs/common';

import { QRCodeService } from 'src/Infrastructure/Apis/qrcode.service';
import { PaymentsService } from '../../Application/services/payments.service';
import { PaymentsAdapter } from '../../Domain/Adapters/payments.adapter';
import { PaymentsRepository } from '../../Domain/Repositories/paymentsRepository';
import { PrismaService } from '../../Infrastructure/Apis/prisma.service';
import { ConfirmPaymentListener } from '../../Infrastructure/Events/listeners/confirmPayment.listener';
import { PaymentsController } from './payments.controller';
import { ConfigService } from '@nestjs/config';

@Module({
  imports: [],
  controllers: [PaymentsController],
  providers: [
    { provide: PaymentsRepository, useClass: PaymentsAdapter },
    ConfigService,
    PaymentsService,
    PrismaService,
    ConfirmPaymentListener,
    QRCodeService,
  ],
})
export class PaymentsModule {}
