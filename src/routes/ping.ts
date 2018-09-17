import config from "../config/config";
const logger: any = require("pino")({ level: config.logLevel });

export function setupRoutes(fastify) {
  /**
   * @api {get} /ping Healthcheck endpoint
   * @apiGroup Healtcheck
   */
  fastify.get("/ping", (request, reply) => {
    logger.info("Ping completed successfully");
    reply.code(200).send({ ping: true });
  });
}
