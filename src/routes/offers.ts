import * as jwt from "jsonwebtoken";
import config from "../config/config";
import IUser from "../models/iUser";
import OffersService from "../services/offers";
import IOffer from "../models/IOffer";
import OfferLookupsService from "../services/offerLookups";
const logger: any = require("pino")({ level: config.logLevel });

export function setupRoutes(fastify) {
  
  /**
   * @api {post} /offers Insert an offer into the database for logged in user
   * @apiGroup Offers
   * @apiName CreateOffer
   * @apiParam {String} citySlug the city slug(lower case cities names: toronto, vancouver, ottawa)
   * @apiParam {String} sourceCoinSymbol the coin symbol of the currency the user has(upper case cities names: USD, CAD, BRL, BTC, ETH)
   * @apiParam {String} destCoinSymbol the coin symbol of the currency the user wants(upper case cities names: USD, CAD, BRL, BTC, ETH)
   * @apiParam {Number} wantedPricePerUnit the price for the offer (sourceCoinSymbol isCAD, destCoinSymbol BRL, so wanted price 2.81)
   * @apiParam {Number} amount the amount desired regarding the destCoinSymbol(you want 1000cad and have brl, this field will be 1000)
   * @apiParam {Number} [minAmount] the minimum amount the user would be interested in(the amount is 1000 but the user may accept an offer with a lower amount)
   */
  fastify.post("/offers", async (request, reply) => {
    try {
      const token = request.headers['x-access-token'];
      if (!token) {
        return reply.code(401).send({ auth: false, message: 'User not logged in.' });
      }
      const invalidPayloadMsg = isOfferPayloadNotValid(request.body);
      if (invalidPayloadMsg) {
        logger.error(invalidPayloadMsg);
        return reply.code(400).send({ msg: invalidPayloadMsg });
      }
      const user: IUser = await jwt.verify(token, config.tokenSecret) as IUser;
      
      const offer: IOffer = {
        userId: user.id,
        citySlug: request.body.citySlug && request.body.citySlug.trim().toLowerCase(),
        sourceCoinSymbol: request.body.sourceCoinSymbol && request.body.sourceCoinSymbol.trim().toUpperCase(),
        destCoinSymbol: request.body.destCoinSymbol && request.body.destCoinSymbol.trim().toUpperCase(),
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
   * @apiParam {String} [citySlug] the city slug(lower case cities names: toronto, vancouver, ottawa)
   * @apiParam {String} [sourceCoinSymbol] the coin symbol of the currency the user has(upper case cities names: USD, CAD, BRL, BTC, ETH)
   * @apiParam {String} [destCoinSymbol] the coin symbol of the currency the user wants(upper case cities names: USD, CAD, BRL, BTC, ETH)
   * @apiParam {Number} [wantedPricePerUnit] the price for the offer (sourceCoinSymbol isCAD, destCoinSymbol BRL, so wanted price 2.81)
   * @apiParam {Number} [amount] the amount desired regarding the destCoinSymbol(you want 1000cad and have brl, this field will be 1000)
   * @apiParam {Number} [minAmount] the minimum amount the user would be interested in(the amount is 1000 but the user may accept an offer with a lower amount)
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
   * @apiParam {String} [city] the city slug(vancouver, ottawa, montreal...)
   * @apiParam {String} [sourceCurrency] the source currency (The currency Symbol: USD, CAD, BRL, etc)
   * @apiParam {String} [targetCurrency] the target currency (The currency Symbol: USD, CAD, BRL, etc)
   */
  fastify.get("/offers", async (request, reply) => {
    try {
      const offerService = new OffersService();
      const query = {
        citySlug: request.query.city && request.query.city.trim().toLowerCase(),
        sourceCoinSymbol: request.query.sourceCurrency && request.query.sourceCurrency.trim().toUpperCase(),
        destCoinSymbol: request.query.targetCurrency && request.query.targetCurrency.trim().toUpperCase(),
      }
      console.log(`offers rout query: ${JSON.stringify(query, null,2)}`);
      const offers = await offerService.get(query);
      const response = { result: offers };
      reply.code(200).send(response);
      // asynchronously inserting OfferLookup
      const offerLookupService = new OfferLookupsService();
      const dbOfferLookup = await offerLookupService.insert(query);
      logger.info(`inserting OfferLookup : ${JSON.stringify(dbOfferLookup)}`);
    } catch (error) {
      reply.code(500).send(error);
      logger.error(error);
    }
  });

}

function isOfferPayloadNotValid(offer: IOffer) {
  if (!offer.citySlug) {
    return 'Missing field "citySlug"';
  }
  if (!offer.amount) {
    return 'Missing field "amount"';
  }
  if (!offer.sourceCoinSymbol) {
    return 'Missing field "sourceCoinSymbol"';
  }
  if (!offer.destCoinSymbol) {
    return 'Missing field "destCoinSymbol"';
  }
  if (!offer.wantedPricePerUnit) {
    return 'Missing field "wantedPricePerUnit"';
  }
  return null;
}