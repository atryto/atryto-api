import config from "../config/config";
import * as Pino from 'pino';
import { Logger } from 'pino';

export default class Log {

  private static instance: Log;
  private logger: Logger;

  public static getInstance(useSchema: boolean = false): Log {
    if (!this.instance) {
      this.instance = new Log();
      this.instance.startLogger();
    }
    return this.instance;
  }

  private startLogger(){
    this.logger = Pino({ 
      level: config.logLevel,
      prettyPrint: {
        colorize: true,
        crlf: false,
        errorLikeObjectKeys: ['err', 'error'],
        errorProps: '',
        levelFirst: false,
        messageKey: 'msg',
        translateTime: 'UTC:h:MM:ss TT Z',
      }
    });
  }

  public getLogger(): Logger {
    return this.logger;
  }

}
