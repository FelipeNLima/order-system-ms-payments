import { Injectable, Logger } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { PaymentsService } from '../../../Application/services/payments.service';
import {
  PaymentEvents,
  PaymentStatus,
} from '../../../Domain/Enums/paymentStatus';
import { ConfirmPaymentEvent } from '../confirmPaymentEvent';

@Injectable()
export class ConfirmPaymentListener {
  constructor(private readonly paymentsService: PaymentsService) {}

  @OnEvent(PaymentEvents.CONFIRM_PAYMENT)
  async handlePushNotificationHeaderCreatedEvent(event: ConfirmPaymentEvent) {
    Logger.log(`WebHook is running.`);
    const { payload } = event;

    if (payload.status !== PaymentStatus.PAID) {
      await this.paymentsService.update({
        ...payload,
        status: PaymentStatus.PAID,
      });
    }
    Logger.log(`WebHook is finished.`);
  }
}
