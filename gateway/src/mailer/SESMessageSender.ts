import { SES } from 'aws-sdk';
import { SendEmailRequest } from 'aws-sdk/clients/ses';

const { AWS_REGION, AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY, AWS_SES_EMAIL } =
  process.env;

export class SESMessageSender {
  ses: SES;

  constructor() {
    this.ses = this.connectToSES();
  }

  connectToSES() {
    const ses = new SES({
      region: AWS_REGION,
      credentials: {
        accessKeyId: AWS_ACCESS_KEY_ID,
        secretAccessKey: AWS_SECRET_ACCESS_KEY,
      },
    });

    return ses;
  }

  async sendMessage(email, data) {
    return this.ses.sendEmail(this.recoveryMessage(email, data)).promise();
  }

  recoveryMessage(email, data): SendEmailRequest {
    return {
      Source: AWS_SES_EMAIL,
      Destination: { ToAddresses: [email] },
      Message: {
        Subject: {
          Data: 'Password recovery',
        },
        Body: {
          Text: {
            Data: `Follow that link to recover your pasword: ${data}`,
          },
        },
      },
    };
  }
}
