import { SESMessageSender } from './SESMessageSender';
import { SQSMessageReceiver } from './SQSMessageReceiver';

new SQSMessageReceiver(new SESMessageSender());
