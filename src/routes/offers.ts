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
   * @apiGroup Offers
   * @apiName CreateOffer
   * @apiParam {Number} userId the user id
   * @apiParam {String} citySlug the city slug
   * @apiParam {String} sourceCoinSymbol the coin symbol of the currency the user has
   * @apiParam {String} destCoinSymbol the coin symbol of the currency the user wants
   * @apiParam {Number} wantedPricePerUnit the price for the offer
   * @apiParam {Number} amount the amount desired
   * @apiParam {Number} [minAmount] the minimum amount the user would be interested in
   */
  fastify.post("/offers", async (request, reply) => {
    try {
      const token = request.headers['x-access-token'];
      if (!token) {
        return reply.code(401).send({ auth: false, message: 'User not logged in.' });
      }

      if (!request.body.citySlug || !request.body.amount || !request.body.sourceCoinSymbol ||
        !request.body.destCoinSymbol || !request.body.wantedPricePerUnit) {
        logger.error('Missing field');
        reply.code(400).send({ msg: "Missing field" });
      }
      const user: IUser = await jwt.verify(token, config.tokenSecret) as IUser;
      const offer: IOffer = {
        userId: user.id,
        citySlug: request.body.citySlug,
        sourceCoinSymbol: request.body.sourceCoinSymbol,
        destCoinSymbol: request.body.destCoinSymbol,
        wantedPricePerUnit: request.body.wantedPricePerUnit,
        minAmount: request.body.minAmount,
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
   
   * @apiGroup Offers
   * @apiParam {String} id the Id
   */
  /**
   * @api {put} /offers/:id Edit an offer
   * @apiGroup Offers
   * @apiName EditOffer
   * @apiParam {String} [citySlug] the city slug
   * @apiParam {String} [sourceCoinSymbol] the coin symbol of the currency the user has
   * @apiParam {String} [destCoinSymbol] the coin symbol of the currency the user wants
   * @apiParam {Number} [wantedPricePerUnit] the price for the offer
   * @apiParam {Number} [amount] the amount desired
   * @apiParam {Number} [minAmount] the minimum amount the user would be interested in
   */
  fastify.put("/offers/:id", async (request, reply) => {
    try {
      var token = request.headers['x-access-token'];
      if (!token) 
        return reply.code(401).send({ auth: false, message: 'No token provided.' });
      
      const user: IUser = await jwt.verify(token, config.tokenSecret) as IUser;
      if (!user) {
        return reply.code(401).send({ auth: false, message: 'Failed to authenticate token.' });
      }
      request.body.userId = user.id;
      const service = new OffersService();
      const result = await service.update(request.params.id, request.body);
      reply.code(200).send(result);
    } catch (error) {
      reply.code(500).send(error);
      logger.error(error);
    }
  });

  /**
   * @api {get} /offers Returns All Offers
   * @apiGroup Offers
   * @apiParam {String} [city] the Id
   * @apiParam {String} [sourceCurrency] the source currency
   * @apiParam {String} [targetCurrency] the target currency
   */
  fastify.get("/offers", async (request, reply) => {
    try {
      const offerService = new OffersService();
      const query = {
        citySlug: request.query.city && request.query.city.trim().toLowerCase(),
        sourceCoinSymbol: request.query.sourceCurrency && request.query.sourceCurrency.trim().toUpperCase(),
        destCoinSymbol: request.query.targetCurrency && request.query.targetCurrency.trim().toUpperCase(),
      }
      const offers = await offerService.get(query);
      const response = { result: offers };
      reply.code(200).send(response);
      // asynchronously inserting OfferLookup
      const offerLookupService = new OfferLookupsService();
      const dbOfferLookup = offerLookupService.insert(query);
      logger.info(`inserting OfferLookup : ${JSON.stringify(dbOfferLookup)}`);
    } catch (error) {
      reply.code(500).send(error);
      logger.error(error);
    }
  });

}
