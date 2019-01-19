import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import * as FastifyMaster from "fastify";
import { IncomingMessage, Server, ServerResponse } from "http";
import config from "./config/config";
import Db from "./globals/db";
import * as pingRoutes from "./routes/ping";
import * as userRoutes from "./routes/users";
import * as offerRoutes from "./routes/offers";
import * as dotenv from 'dotenv';

dotenv.config();
const logger: any = require("pino")({ level: config.logLevel });

type Fastify = FastifyInstance<Server, IncomingMessage, ServerResponse>;
type FastifyReq = FastifyRequest<IncomingMessage>;
type FastifyRes = FastifyReply<ServerResponse>;

export default class App {
  private fastify: Fastify;

  constructor() {
    this.fastify = FastifyMaster();
    this.fastify.use(require("cors")());
    Db.getInstance(true);

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
        logger.error(err);
        process.exit(1);
      }
      logger.info(`server listening on ${this.fastify.server.address().port}`);
    });
  }

}
