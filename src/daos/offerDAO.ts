import AbstractCrudDAO from "./abstractCrudDAO";
import IOffer from "../models/IOffer";
import IOfferLookup from "../models/IOfferLookup";

export default class OfferDAO extends AbstractCrudDAO<IOffer> {
  
  constructor() {
    super('offers');
  }

  public async insertOfferLookup(offerLookup: IOfferLookup) {
    return this.insertQuery(offerLookup, 'offerlookups');
  }

}
