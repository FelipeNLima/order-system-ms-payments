import {
  DeleteMessageCommand,
  ReceiveMessageCommand,
  SQSClient,
  SendMessageCommand,
} from '@aws-sdk/client-sqs';
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
  }

  async sendMessageAsBase64(message: any, queueUrl: string) {
    const params = {
      DelaySeconds: 10,
      MessageBody: Buffer.from(JSON.stringify(message)).toString('base64'),
      QueueUrl: queueUrl,
    };

    return await this.sqsClient.send(new SendMessageCommand(params));
  }

  async sendRawMessage(rawMessage: any, queueUrl: string) {
    const params = {
      DelaySeconds: 10,
      MessageBody: rawMessage,
      QueueUrl: queueUrl,
    };

    return await this.sqsClient.send(new SendMessageCommand(params));
  }
  async retrieveMessage(queueUrl: string) {
    const params = {
      MaxNumberOfMessages: 10,
      MessageAttributeNames: ['All'],
      QueueUrl: queueUrl,
      VisibilityTimeout: 20,
      WaitTimeSeconds: 5,
    };

    const data = await this.sqsClient.send(new ReceiveMessageCommand(params));
    return data;
  }

  async deleteMessage(queueUrl: string, receiptHandle: string) {
    const params = {
      QueueUrl: queueUrl,
      ReceiptHandle: receiptHandle,
    };

    await this.sqsClient.send(new DeleteMessageCommand(params));
  }
}
