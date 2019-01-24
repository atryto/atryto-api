import OffersService from "./offers";
import * as Mailgun from 'mailgun-js';
import config from "../config/config";
import UsersService from "./users";
import ICrudService from "./iCrudService";
import OfferMatch from "../models/OfferMatch";
import Offer from "../models/Offer";
import User from "../models/User";
import Log from "../globals/logger";
import { Logger } from "pino";
import * as Boom from "boom";
import IEmail from "../models/interfaces/IEmail";
import Mailer from "../globals/mailer";

export default class OfferMatchesService implements ICrudService<OfferMatch> {
  
  private logger: Logger;
  private mailer: Mailer;

  constructor() {
    this.logger = Log.getInstance().getLogger();
    this.mailer = Mailer.getInstance();
  }
  
  private async sendEmail(offer: Offer, offerMatch: OfferMatch) {
    const userService = new UsersService();
    const userOffer: User = await userService.getById(offer.userId);
    const userMatching: User = await userService.getById(offerMatch.userId);
    const data: IEmail = {
      from: config.emailSender,
      to: userOffer.email,
      subject: 'Someone has matched your offer',
      html: `Hello, the user ${userMatching.username}(email: ${userMatching.email}) has matched your offer id ${offer.id}. Contact him directly so you both can negotiate and finish the deal. Please do remember to verify his identity, Read our terms of service that states we are not responsible for any problem occured after the offer match. best of luck and please let us know how it ended.`
    };
    this.mailer.sendEmail(data);
  }

  public async insert(model: any): Promise<OfferMatch> {
    const offerService = new OffersService();
    const offer: Offer = await offerService.getById(model.offerId);
    if (!offer) {
      throw Boom.notFound('Offer not found');
    }
    if (offer.userId === model.userId) {
      throw Boom.forbidden('User cannot bid its own offer');
    }
    const inserted  = await OfferMatch.create(model);
    this.sendEmail(offer, model);
    return inserted;
  }

  public async get(where: any, limit: number = null, offset: number = null,
    attributes: string[] = null, order: any[] = null): Promise<OfferMatch[]> {
    try {
      const query: any = {};
      
      if (where) query.where = where;
      if (limit) query.limit = limit;
      if (offset) query.offset = offset;
      if (attributes) query.attributes = attributes;

      const offerMatches = await OfferMatch.findAll(query);
      return offerMatches;
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }

  public async getById(id: number): Promise<OfferMatch> {
    try {
      const offerMatch: OfferMatch = await OfferMatch.findById(id) as OfferMatch;
      return offerMatch;
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }

  
  public async update(id:number, model: any): Promise<OfferMatch> {
    const foundOfferMatch: OfferMatch = await this.getById(id);
    if (!foundOfferMatch) {
      throw Boom.notFound('Offer not found');
    }
    await foundOfferMatch.update(model);
    return foundOfferMatch;
  }

  public async delete(id: number): Promise<Boolean> {
    try {
      const foundModel: OfferMatch = await this.getById(id);
      await foundModel.destroy();
      return true;
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }

}
