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
const logger: any = require("pino")({ level: config.logLevel });

export default class OfferMatchesService implements ICrudService<OfferMatch> {
  
  private logger: Logger;

  constructor() {
    this.logger = Log.getInstance().getLogger();
  }
  
  private async sendEmail(offer: Offer, offerMatch: OfferMatch) {
    const userService = new UsersService();
    const userOffer: User = await userService.getById(offer.userId);
    const userMatching: User = await userService.getById(offerMatch.userId);
    const mailgun = new Mailgun({apiKey: 'b0538c90b8838fba5da3f182df6b87c2-3939b93a-fb0784ad'/*config.mailgunKey*/, domain: config.mailgunDomain});
    var data = {
      //Specify email data
        from: 'info@ghtechnology.ca',
      //The email to contact
        to: userOffer.email,
      //Subject and text data
        subject: 'Someone has matched your offer',
        html: `Hello, the user ${userMatching.username}(email: ${userMatching.email}) has matched your offer id ${offer.id}. Contact him directly so you both can negotiate and finish the deal. Please do remember to verify his identity, Read our terms of service that states we are not responsible for any problem occured after the offer match. best of luck and please let us know how it ended.`
      }
      //Invokes the method to send emails given the above data with the helper library
      mailgun.messages().send(data, function (err, body) {
          //If there is an error, render the error page
          if (err) {
              console.log("got an error: ", err);
              logger.error(err);
          }
          logger.info(`Email sent successfully for offer ${JSON.stringify(offerMatch, null, 2)}`);
      });
  }

  public async insert(model: any): Promise<OfferMatch> {
    const offerService = new OffersService();
    const offer: Offer = await offerService.getById(model.offerId);
    if (!offer) {
      throw new Error('Offer not found');
    }
    if (offer.userId === model.userId) {
      throw new Error('User cannot bid its own offer');
    }
    const inserted  = await OfferMatch.create(model);
    this.sendEmail(offer, model);
    return inserted;
  }

  public async get(model: any): Promise<OfferMatch[]> {
    try {
      const offerMatches = await OfferMatch.findAll(model);
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
      throw Error('Offer not found');
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
