import { SQSClient, SendMessageCommand } from '@aws-sdk/client-sqs';
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AwsSqsService {
  sqsClient: SQSClient;

  private readonly ENDPOINT = this.configService.get<string>('ENDPOINT');
  private readonly AWS_REGION = this.configService.get<string>('AWS_REGION');

  constructor(private readonly configService: ConfigService) {
    this.sqsClient = new SQSClient({
      region: this.AWS_REGION,
      endpoint: this.ENDPOINT,
    });
  }

  private readonly logger = new Logger(AwsSqsService.name);

  async sendMessage(message: any, queueUrl?: string) {
    const params = {
      DelaySeconds: 10,
      MessageBody: JSON.stringify(message),
      QueueUrl: queueUrl,
    };

    await this.sqsClient.send(new SendMessageCommand(params));
    this.logger.log(`### SEND QUEUE ### -> ${queueUrl}`);
  }
}
