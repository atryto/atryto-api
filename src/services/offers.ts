import IOffer from "../models/IOffer";
import OfferDAO from "../daos/offerDAO";

export default class OffersService {
  private dao: OfferDAO;

  constructor() {
    this.dao = new OfferDAO();
  }

  public async insert(offer: IOffer) {
    try {
      const result = await this.dao.insert(offer);
      return result;
    } catch (error) {
      throw error;
    }
  }

  public async get(offer: IOffer) {
    try {
      const offers = await this.dao.get(offer);
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
