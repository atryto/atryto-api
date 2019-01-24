export default interface IEmail {
    from: string;
    to: string | string[];
    cc?: string;
    bcc?: string;
    subject: string;
    text?: string;
    html: string;
    'recipient-variables'?: any,
    attachment?: string | Buffer;
  }