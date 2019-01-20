import AbstractService from "./abstractService";
import OfferMatchDAO from "../daos/offerMatchDAO";
import IOfferMatch from "../models/IOfferMatch";
import OffersService from "./offers";
import IOffer from "../models/IOffer";
import * as Mailgun from 'mailgun-js';
import config from "../config/config";
import UsersService from "./users";
import IUser from "../models/iUser";
const logger: any = require("pino")({ level: config.logLevel });

export default class OfferMatchesService extends AbstractService<IOfferMatch> {
  
  constructor() {
    super(new OfferMatchDAO());
  }

  private async sendEmail(offer: IOffer, offerMatch: IOfferMatch) {
    const userService = new UsersService();
    const userOffer: IUser = await userService.getById(offer.userId);
    const userMatching: IUser = await userService.getById(offerMatch.userId);
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

  public async insert(model: IOfferMatch) {
    const offerService = new OffersService();
    const offer:IOffer = await offerService.getById(model.offerId);
    if (!offer) {
      throw new Error('Offer not found');
    }
    if (offer.userId === model.userId) {
      throw new Error('User cannot bid its own offer');
    }
    const inserted  = await super.insert(model);
    this.sendEmail(offer, model);
    return inserted;
  }

}
