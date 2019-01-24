import config from "../config/config";
import * as Mailgun from 'mailgun-js';
import { Logger } from 'pino';
import Log from "./logger";
import IEmail from "../models/interfaces/IEmail";

export default class Mailer {

  private static instance: Mailer;
  private logger: Logger;
  private mailgun: any;

  public static getInstance(): Mailer {
    if (!this.instance) {
      this.instance = new Mailer();
      this.instance.logger = Log.getInstance().getLogger();
      this.instance.mailgun = new Mailgun({apiKey: config.mailgunKey, domain: config.mailgunDomain});
    }
    return this.instance;
  }

  public async sendEmail(emailInfo: IEmail) {
    const insideLogger = this.logger;
    this.mailgun.messages().send(emailInfo, function (err, body) {
        if (err) {
          insideLogger.error(`error sending email`, emailInfo, err);
        }
        insideLogger.info('Email sent successfully', body);
    });
  }

}
