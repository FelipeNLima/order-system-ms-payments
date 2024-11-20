import { SQSClient, SendMessageCommand } from '@aws-sdk/client-sqs';
import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class AwsSqsService {
  sqsClient: SQSClient;

  constructor() {
    this.sqsClient = new SQSClient({ region: 'sa-east-1' });
  }

  private readonly logger = new Logger(AwsSqsService.name);

  async sendMessage(message: any, queueUrl: string) {
    const params = {
      DelaySeconds: 10,
      MessageBody: JSON.stringify(message),
      QueueUrl: queueUrl,
    };

    await this.sqsClient.send(new SendMessageCommand(params));
    this.logger.log('### SEND QUEUE ###');
  }
}
