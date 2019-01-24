import Offer from "../models/Offer";
import { Logger } from "pino";
import Log from "../globals/logger";
import ICrudService from "./iCrudService";
import Mailer from "../globals/mailer";
import Db from "../globals/db";
import IEmail from "../models/interfaces/IEmail";
import config from "../config/config";
import UsersService from "./users";

export default class OffersService implements ICrudService<Offer> {
  
  private logger: Logger;
  private mailer: Mailer;
  private db: Db;

  constructor() {
    this.logger = Log.getInstance().getLogger();
    this.mailer = Mailer.getInstance();
    this.db = Db.getInstance();
  }

  public async insert(model: any): Promise<Offer> {
    try {
      const result = await Offer.create(model);
      this.sendEmailToTop10Offers(result);
      return result;
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }

  public async get(where: any, limit: number = null, offset: number = null,
    attributes: string[] = null, order: any[] = null): Promise<Offer[]> {
    try {
      const query: any = {};
      
      if (where) query.where = where;
      if (limit) query.limit = limit;
      if (offset) query.offset = offset;
      if (attributes) query.attributes = attributes;

      const offers = await Offer.findAll(query);
      return offers;
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }

  public async getById(id: number): Promise<Offer> {
    try {
      const offer: Offer = await Offer.findById(id) as Offer;
      return offer;
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }

  
  public async update(id:number, model: any): Promise<Offer> {
    const foundOffer: Offer = await this.getById(id);
    if (!foundOffer) {
      throw Error('Offer not found');
    }
    if (model.userId && foundOffer.userId != model.userId) {
      throw Error('You do not have authorization to modify this offer');
    }
    delete model.userId;
    await foundOffer.update(model);
    return foundOffer;
  }

  public async delete(id: number): Promise<Boolean> {
    try {
      const foundModel: Offer = await this.getById(id);
      await foundModel.destroy();
      return true;
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }

  public async sendEmailToTop10Offers(offer: Offer) {
    try {
      const userService = new UsersService();
      const Op = this.db.getSequelize().Op;
      const offers: Offer[] = await this.get({
        sourceCoinSymbol: offer.destCoinSymbol,
        destCoinSymbol: offer.sourceCoinSymbol,
        citySlug: offer.citySlug,
        userId: {
          [Op.ne]: offer.userId,
        }
      }, 10, 0, null, [ ['wantedPricePerUnit', 'ASC'] ]);
      if (offers.length <= 0) {
        this.logger.info('sendEmailToTop10Offers',
          `No offers for pair (${offer.destCoinSymbol}, ${offer.sourceCoinSymbol})`);
        return;  
      }
      const offersWithEmail = [];
      for (const offer of offers) {
        const email = await userService.getById(offer.userId);
        offersWithEmail.push({ ...offer, userEmail: email });
      }
      this.logger.info(
        `offer id ${offer.id} created, pair (${offer.sourceCoinSymbol}, ${offer.destCoinSymbol})`,
        `Sending email to top 10 offers of the opposite pair (${offer.destCoinSymbol}, ${offer.sourceCoinSymbol})`,
        offers
      );
      const data: IEmail = {
        from: config.emailSender,
        to: offersWithEmail.map(o => o.userEmail),
        subject: 'Hey! someone has created an offer that may be interesting',
        'recipient-variables': offersWithEmail,
        html: `Hello, we saw you have a <a href="${config.apiURL}/offers/%recipient.id%}">listed offer</a>  and we've found there is an offer that may match yours or is at the very least interesting for you to check, <a href="${config.apiURL}/offers/${offer.id}">click here</a> to check the offer.`
      };
      this.mailer.sendEmail(data); 
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }

}
