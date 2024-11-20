import { Message } from '@aws-sdk/client-sqs';
import {
  Global,
  Injectable,
  Logger,
  OnModuleDestroy,
  OnModuleInit,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Consumer } from 'sqs-consumer';
import { PaymentsService } from '../../Application/services/payments.service';

@Global()
@Injectable()
export class ConsumerService implements OnModuleInit, OnModuleDestroy {
  private consumer: Consumer;
  private readonly logger = new Logger(ConsumerService.name);
  private readonly QUEUE = this.configService.get<string>('QUEUE');
  private readonly ENDPOINT = this.configService.get<string>('ENDPOINT');

  constructor(
    private readonly paymentsService: PaymentsService,
    private readonly configService: ConfigService,
  ) {
    this.consumer = Consumer.create({
      queueUrl: `${this.ENDPOINT}${this.QUEUE}`,
      handleMessage: async (message) => this.processMessage(message),
      batchSize: 10,
    });
  }

  onModuleInit() {
    this.consumer.start();
  }

  onModuleDestroy() {
    if (this.consumer) {
      this.consumer.stop();
    }
  }

  public async processMessage(message: Message) {
    try {
      this.logger.log('###[RUN CONSUMER]###');
      const queueBody = message.Body;
      if (queueBody) {
        const data = JSON.parse(queueBody);
        await this.paymentsService.create({
          ...data,
        });
      }
    } catch (err) {
      this.logger.error('###[ERROR CONSUMER]###', err);
    } finally {
      this.logger.log('###[FINISH CONSUMER]###');
    }
  }
}
