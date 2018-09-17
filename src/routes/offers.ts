import * as jwt from "jsonwebtoken";
import config from "../config/config";
import IUser from "../models/iUser";
import OffersService from "../services/offers";
import IOffer from "../models/IOffer";
import OfferLookupsService from "../services/offerLookups";
const logger: any = require("pino")({ level: config.logLevel });

export function setupRoutes(fastify) {
  /**
   * @api {post} /offers Insert an offer into the database
   * @apiGroup Users
   * @apiParam {String} email the user email
   * @apiParam {String} name the user display name
   * * @apiParam {String} password the user password
   */
  fastify.post("/offers", async (request, reply) => {
    try {
      const token = request.headers['x-access-token'];
      if (!token) {
        return reply.code(401).send({ auth: false, message: 'User not logged in.' });
      }

      if (!request.body.type || !request.body.cityslug || !request.body.amount ||
          !request.body.sourcecoinsymbol || !request.body.destcoinsymbol || !request.body.wantedpriceperunit) {
        logger.error('Missing field');
        reply.code(400).send({ msg: "Missing field" });
      }
      const user: IUser = await jwt.verify(token, config.tokenSecret) as IUser;
      const offer: IOffer = {
        userid: user.id,
        type: request.body.type,
        cityslug: request.body.cityslug,
        sourcecoinsymbol: request.body.sourcecoinsymbol,
        destcoinsymbol: request.body.destcoinsymbol,
        wantedpriceperunit: request.body.wantedpriceperunit,
        minamount: request.body.minamount,
        amount: request.body.amount,
      }
      const service = new OffersService();
      const result = await service.insert(offer);
      reply.code(200).send(result);
      logger.info(`Offer insertion: ${JSON.stringify(result)}`);
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
  fastify.put("/offers", async (request, reply) => {
    try {
      var token = request.headers['x-access-token'];
      if (!token) 
        return reply.code(401).send({ auth: false, message: 'No token provided.' });
      
      const verified = await jwt.verify(token, config.tokenSecret);
      if (!verified) {
        return reply.code(401).send({ auth: false, message: 'Failed to authenticate token.' });
      }
      reply.code(200).send({msg: 'User authenticated successfully'});
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
  fastify.get("/offers", async (request, reply) => {
    try {
      const offerService = new OffersService();
      if (!request.query || !request.query.cityslug || !request.query.sourcecoinsymbol  || !request.query.destcoinsymbol) {
        reply.code(400).send({ msg: "Missing field" });
        logger.error('Missing field');
      }
      const offers = await offerService.get(request.query);
      const response = { result: offers };
      reply.code(200).send(response);
      // asynchronously inserting OfferLookup
      const offerLookupService = new OfferLookupsService();
      const dbOfferLookup = offerLookupService.insert(request.query);
      logger.info(`inserting OfferLookup : ${JSON.stringify(dbOfferLookup)}`);
    } catch (error) {
      reply.code(500).send(error);
      logger.error(error);
    }
  });

}
