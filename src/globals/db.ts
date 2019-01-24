import { Sequelize } from "sequelize-typescript";
import config from "../config/config";
import * as path from "path";
import Log from "./logger";
import { Logger } from "pino";

export default class Db {
  private static instance: Db;
  private sequelize: Sequelize;

  public static getInstance(): Db {
    if (!this.instance) {
      this.instance = new Db();
      this.instance.connect();
    }
    return this.instance;
  }

  private connect() {
    this.sequelize = new Sequelize({
      host: config.database.host,
      database: config.database.schema,
      dialect: config.database.dialect,
      username: config.database.user,
      password: config.database.password,
      modelPaths: [path.join(__dirname,'../models')]
    });
    const logger: Logger = Log.getInstance().getLogger();
    logger.info('Database Connected...');
  }

  public getSequelize(): Sequelize {
    return this.sequelize;
  }
}
