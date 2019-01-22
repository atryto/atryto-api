import * as jwt from "jsonwebtoken";
import config from "../config/config";
import UsersService from "../services/users";
const logger: any = require("pino")({ level: config.logLevel });

export function setupRoutes(fastify) {
  /**
   * @api {post} /users Insert an user into the database
   * @apiGroup Users
   * @apiName CreateUser 
   * @apiParam {String} id the Id
   * @apiParam {String} email the email
   * @apiParam {String} username the username
   * @apiParam {String} password the password
   * @apiParam {String} citySlug the default city for that user
   * @apiParam {String} [profilePictureUrl] the profile picture URL
   * @apiParam {Boolean} [allowOnlineTransactions] flag to check whether use will allow online transactions
   * * @apiParam {String} password the user password
   */
  fastify.post("/users", async (request, reply) => {
    try {
      if (!request.body || !request.body.username ||
          !request.body.email || !request.body.password) {
          reply.code(400).send({ msg: "Missing field" });
          logger.error('Missing field');
      }
      const user: any = request.body;
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
   * @api {post} /users/login Login Returns a valid token
   * @apiGroup Users
   * @apiName Login
   * @apiParam {String} password the password
   * @apiParam {String} [email] the email(mandatory is there is no field username)
   * @apiParam {String} [username] the username(mandatory is there is no field email)
   **/
  fastify.post("/users/login", async (request, reply) => {
    try {
      if (!request.body || (!request.body.email && !request.body.username) || !request.body.password) {
        logger.error('Missing field');
        return reply.code(400).send({ msg: "Missing field" });
      }
      const user: any = request.body;
      const userService = new UsersService();
      const token = await userService.login(user);
      reply.code(200).send({token: token});
    } catch (error) {
      reply.code(500).send(error);
      logger.error(error);
    }
  });


  /**
   * @api {get} /users Returns All Users
   * @apiGroup Users
   * @apiName GetUsers
   * @apiParam {String} [id] the Id
   * @apiParam {String} [email] the email
   * @apiParam {String} [username] the username
   * @apiParam {String} [password] the password
   * @apiParam {String} [profilePictureUrl] the profile picture URL
   * @apiParam {String} [citySlug] the default city for that user
   * @apiParam {Boolean} [allowOnlineTransactions] flag to check whether use will allow online transactions
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
   * @api {get} /users/:id Returns an user by its id
   * @apiGroup Users
   * @apiName GetUserById
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
   * @api {put} /users/:id Edit a user that will be find out according to the token
   * @apiGroup Users
   * @apiName EditUser
   * @apiParam {String} id the Id
   * @apiParam {String} [password] the password
   * @apiParam {String} [profilePictureUrl] the profile picture URL
   * @apiParam {String} [citySlug] the default city for that user
   * @apiParam {Boolean} [allowOnlineTransactions] flag to check whether use will allow online transactions
   */
  fastify.put("/users/:id", async (request, reply) => {
    try {
      if(!request.params || !request.params.id) {
        throw Error('Missing id path parameter');
      }
      const token = request.headers['x-access-token'];
      if (!token) {
        return reply.code(401).send({ auth: false, message: 'No token provided.' });
      }
      const user: any = await jwt.verify(token, config.tokenSecret);
      if (!user) {
        return reply.code(401).send({ auth: false, message: 'Failed to authenticate token.' });
      }
      // TO DO: We need to create role for users so admins can also edit users
      if (request.params.id != user.id) {
        return reply.code(401).send({ auth: false, message: 'You do not have permission to edit this user.' });
      }
      
      const userService = new UsersService();
      const updatedUser = await userService.update(request.params.id, request.body);
      reply.code(200).send(updatedUser);
    } catch (error) {
      reply.code(500).send(error);
      logger.error(error);
    }
  });

  /**
   * @api {delete} /users Deletes a logged in user
   * @apiGroup Users
   * @apiName DeleteUser
   * @apiParam {String} id the Id
   */
  fastify.delete("/users", async (request, reply) => {
    try {
      const token = request.headers['x-access-token'];
      if (!token) {
        return reply.code(401).send({ auth: false, message: 'No token provided.' });
      }
      const user: any = await jwt.verify(token, config.tokenSecret);
      if (!user) {
        return reply.code(401).send({ auth: false, message: 'Failed to authenticate token.' });
      }
      if (!user.id) {
        return reply.code(404).send({message: 'User id not found.' });
      }
      const userService = new UsersService();
      const users = await userService.delete(user.id);
      const response = { result: users };
      reply.code(200).send(response);
      logger.info(JSON.stringify(response));
    } catch (error) {
      reply.code(500).send(error);
      logger.error(error);
    }
  });

}
