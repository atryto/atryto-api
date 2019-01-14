import IOffer from "../models/IOffer";
import OfferDAO from "../daos/offerDAO";
import AbstractService from "./abstractService";

export default class OffersService extends AbstractService<IOffer> {
  
  constructor() {
    super(new OfferDAO());
  }

  public async update(id:number, model: IOffer): Promise<Boolean> {
    const foundOffer: IOffer = await this.getById(id);
    if (!foundOffer) {
      throw Error('Offer not found');
    }
    if (model.userId && foundOffer.userId != model.userId) {
      throw Error('You do not have authorization to modify this offer');
    }
    delete model.userId;
    return super.update(id, model);
  }

}
