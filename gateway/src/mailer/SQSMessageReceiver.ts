import { SESMessageSender } from './SESMessageSender';
import { EventEmitter } from 'events';
import { SQS } from 'aws-sdk';
import {
  DeleteMessageBatchRequest,
  ReceiveMessageRequest,
} from 'aws-sdk/clients/sqs';

const { AWS_SQS_URL, AWS_REGION, AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY } =
  process.env;

export class SQSMessageReceiver {
  consumer: SESMessageSender;
  emitter: EventEmitter;
  sqs: SQS;
  params: ReceiveMessageRequest;

  constructor(consumer: SESMessageSender) {
    this.consumer = consumer;
    this.emitter = new EventEmitter();
    this.sqs = this.connectToSQS();
    this.params = {
      WaitTimeSeconds: 20,
      QueueUrl: AWS_SQS_URL,
      MaxNumberOfMessages: 10,
    };

    this.emitter.on('message', this.processMessageFromQueue);

    this.listenMessages();
  }

  connectToSQS() {
    const sqs = new SQS({
      region: AWS_REGION,
      credentials: {
        accessKeyId: AWS_ACCESS_KEY_ID,
        secretAccessKey: AWS_SECRET_ACCESS_KEY,
      },
    });

    return sqs;
  }

  async listenMessages() {
    const messages = await this.sqs.receiveMessage(this.params).promise();

    this.emitter.emit('message', this.processMessageFromQueue(messages));
    this.listenMessages();
  }

  async processMessageFromQueue(messages) {
    if (messages && messages.Messages) {
      const { Messages: messagesArray } = messages;
      const messagesData = messagesArray.map(
        ({ MessageId, Body, ReceiptHandle }) => ({
          MessageId,
          Body: JSON.parse(Body),
          ReceiptHandle,
        }),
      );
      await Promise.all(
        messagesData.map(({ Body: { email, link } }) =>
          this.consumer.sendMessage(email, link),
        ),
      );
      await this.deleteProcessedMessagesFromQueue(messagesData);
    }
  }

  async deleteProcessedMessagesFromQueue(messagesData) {
    const deleteMessage = messagesData.map(({ MessageId, ReceiptHandle }) => ({
      Id: MessageId,
      ReceiptHandle,
    }));
    const params: DeleteMessageBatchRequest = {
      QueueUrl: AWS_SQS_URL,
      Entries: deleteMessage,
    };

    await this.sqs.deleteMessageBatch(params).promise();
  }
}
