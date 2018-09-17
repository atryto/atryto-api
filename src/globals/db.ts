import * as MySQL from "mysql";
import config from "../config/config";
const logger: any = require("pino")({ level: config.logLevel });

export default class Db {

  private static instance: Db;
  private connection: any;

  public static getInstance(useSchema: boolean = false) {
    if (!this.instance) {
      this.instance = new Db();
      if (!useSchema || useSchema === null) {
        this.instance.connect();
      } else {
        this.instance.connectUsingSchema();
      }
    }
    return this.instance;
  }

  private connect() {
    this.connection = MySQL.createConnection({
      connectionLimit: config.database.poolSize,
      host: config.database.host,
      multipleStatements: true,
      password: config.database.password,
      port: config.database.port,
      timezone: config.database.timezone,
      user: config.database.user,
    });
  }

  private connectUsingSchema() {
    this.connection = MySQL.createConnection({
      connectionLimit: config.database.poolSize,
      database: config.database.schema,
      host: config.database.host,
      multipleStatements: true,
      password: config.database.password,
      port: config.database.port,
      timezone: config.database.timezone,
      user: config.database.user,
    });
  }

  public queryWrite(queryString: string, parameters: any): Promise<any> {
    return new Promise<any>( (resolve, reject) => {
      this.connection.query(queryString, parameters, (err: MySQL.MysqlError, data: any) => {
        if (err) {
          reject(err);
        }
        resolve(data);
      });
    });
  }

}
