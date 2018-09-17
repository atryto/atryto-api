import IOfferLookup from "../models/IOfferLookup";
import OfferLookupDAO from "../daos/offerLookupDAO";

export default class OfferLookupsService {
  private dao: OfferLookupDAO;

  constructor() {
    this.dao = new OfferLookupDAO();
  }

  public async insert(offerLookup: IOfferLookup) {
    try {
      const result = await this.dao.insert(offerLookup);
      return result;
    } catch (error) {
      throw error;
    }
  }

  public async get(offerLookup: IOfferLookup) {
    try {
      const offers = await this.dao.get(offerLookup);
      return offers;
    } catch (error) {
      throw error;
    }
  }

  public async getById(id) {
    try {
      const result = await this.dao.getById(id);
      return result;
    } catch (error) {
      throw error;
    }
  }

}
