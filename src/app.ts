import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import * as FastifyMaster from "fastify";
import { IncomingMessage, Server, ServerResponse } from "http";
import config from "./config/config";
import Db from "./globals/db";
import * as pingRoutes from "./routes/ping";
import * as userRoutes from "./routes/users";
import * as offerRoutes from "./routes/offers";
import * as dotenv from 'dotenv';
import Log from "./globals/logger";
import { Logger } from "pino";

dotenv.config();

type Fastify = FastifyInstance<Server, IncomingMessage, ServerResponse>;

export default class App {
  private fastify: Fastify;
  private db: Db;
  private logger: Logger;

  constructor() {
    this.fastify = FastifyMaster();
    this.fastify.use(require("cors")());
    this.fastify.register(require('fastify-boom'));
    this.db = Db.getInstance();
    this.logger = Log.getInstance().getLogger();
    userRoutes.setupRoutes(this.fastify);
    pingRoutes.setupRoutes(this.fastify);
    offerRoutes.setupRoutes(this.fastify);
  }

  public getFastify() { 
    return this.fastify;
  }

  public startServer() {
    this.fastify.listen(+config.port, config.host, (err) => {
      if (err) {
        this.logger.error(err);
        process.exit(1);
      }
      this.logger.info(`server listening on ${this.fastify.server.address().port}`);
    });
  }

}
