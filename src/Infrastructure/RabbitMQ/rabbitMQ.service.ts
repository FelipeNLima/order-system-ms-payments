import { Global, Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import amqp, { ChannelWrapper } from 'amqp-connection-manager';
import { ConfirmChannel } from 'amqplib';
import { PaymentsService } from 'src/Application/services/payments.service';

@Global()
@Injectable()
export class ConsumerService implements OnModuleInit {
  private readonly channelWrapper: ChannelWrapper;
  private readonly logger = new Logger(ConsumerService.name);
  private readonly RABBITMQ_URL = process.env.RABBITMQ_URL;
  private readonly QUEUE = this.configService.get<string>('QUEUE');

  constructor(
    private readonly paymentsService: PaymentsService,
    private readonly configService: ConfigService,
  ) {
    const connection = amqp.connect([`amqp://${this.RABBITMQ_URL}`]);
    this.channelWrapper = connection.createChannel();
  }

  public async onModuleInit() {
    try {
      await this.channelWrapper.addSetup(async (channel: ConfirmChannel) => {
        await channel.assertQueue(`${this.QUEUE}`, { durable: true });
        await channel.consume(`${this.QUEUE}`, async (message) => {
          if (message) {
            const content = JSON.parse(message.content.toString());
            if (content) {
              await this.paymentsService.create({
                ...content,
              });
            }
            channel.ack(message);
          }
        });
      });
      this.logger.log('Consumer service started and listening for messages.');
    } catch (err) {
      this.logger.error('Error starting the consumer:', err);
    }
  }
}
