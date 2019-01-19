import AbstractService from "./abstractService";
import OfferMatchDAO from "../daos/offerMatchDAO";
import IOfferMatch from "../models/IOfferMatch";
import OffersService from "./offers";
import IOffer from "../models/IOffer";

export default class OfferMatchesService extends AbstractService<IOfferMatch> {
  
  constructor() {
    super(new OfferMatchDAO());
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
    return super.insert(model);
  }

}
