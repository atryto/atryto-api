import Offer from "../models/Offer";
import { Logger } from "pino";
import Log from "../globals/logger";
import ICrudService from "./iCrudService";

export default class OffersService implements ICrudService<Offer> {
  
  private logger: Logger;

  constructor() {
    this.logger = Log.getInstance().getLogger();
  }

  public async insert(model: any): Promise<Offer> {
    try {
      const result = await Offer.create(model);
      return result;
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }

  public async get(model: any): Promise<Offer[]> {
    try {
      const offers = await Offer.findAll(model);
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

}
