import * as jwt from "jsonwebtoken";
import config from "../config/config";
import IUser from "../models/iUser";
import UsersService from "../services/users";
const logger: any = require("pino")({ level: config.logLevel });

export function setupRoutes(fastify) {
  /**
   * @api {post} /users Insert an user into the database
   * @apiGroup Users
   * @apiParam {String} email the user email
   * @apiParam {String} name the user display name
   * * @apiParam {String} password the user password
   */
  fastify.post("/users", async (request, reply) => {
    try {
      if (!request.body || !request.body.username ||
          !request.body.email || !request.body.password) {
          reply.code(400).send({ msg: "Missing field" });
          logger.error('Missing field');
      }
      const user: IUser = request.body;
      const userService = new UsersService();
      const result = await userService.insert(user);
      reply.code(200).send(result);
      logger.info(`User insertion: ${JSON.stringify(result)}`);
    } catch (error) {
      reply.code(500).send(error);
      logger.error(error);
    }
  });

  /**
   * @api {post} /users/login - Login Returns a valid token
   * @apiGroup Users
   * @apiParam {String} email the user email
   * @apiParam {String} password the user password
   */
  fastify.post("/users/login", async (request, reply) => {
    try {
      if (!request.body || (!request.body.email && !request.body.username) || !request.body.password) {
        logger.error('Missing field');
        reply.code(400).send({ msg: "Missing field" });
      }
      const user: IUser = request.body;
      const userService = new UsersService();
      const token = await userService.login(user);
      reply.code(200).send({token: token});
    } catch (error) {
      reply.code(500).send(error);
      logger.error(error);
    }
  });


  /**
   * @api {get} /users Returns All Users(allows query params)
   * @apiGroup Users
   * @apiParam {String} id the Id
   */
  fastify.get("/users", async (request, reply) => {
    try {
      const userService = new UsersService();
      
      const users = await userService.get(request.query);
      const response = { result: users };
      reply.code(200).send(response);
      logger.info(JSON.stringify(response));
    } catch (error) {
      reply.code(500).send(error);
      logger.error(error);
    }
  });

  /**
   * @api {get} /users/:id Returns a user according to the id
   * @apiGroup Users
   * @apiParam {String} id the Id
   */
  fastify.get("/users/:id", async (request, reply) => {
    try {
      const userService = new UsersService();
      if(!request.params || !request.params.id) {
        throw Error('Missing id path parameter');
      }
      const users = await userService.getById(request.params.id);
      const response = { result: users };
      reply.code(200).send(response);
      logger.info(JSON.stringify(response));
    } catch (error) {
      reply.code(500).send(error);
      logger.error(error);
    }
  });

  /**
   * @api {put} /users Edit a user that will be find out according to the token
   * @apiGroup Users
   * @apiParam {String} id the Id
   */
  fastify.put("/users", async (request, reply) => {
    try {
      const token = request.headers['x-access-token'];
      if (!token) {
        return reply.code(401).send({ auth: false, message: 'No token provided.' });
      }
      const user = await jwt.verify(token, config.tokenSecret);
      if (!user) {
        return reply.code(401).send({ auth: false, message: 'Failed to authenticate token.' });
      }
      // TODO EDIT USER
      reply.code(200).send({msg: 'User authenticated successfully'});
    } catch (error) {
      reply.code(500).send(error);
      logger.error(error);
    }
  });

}
