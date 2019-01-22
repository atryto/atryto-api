import OfferLookup from "../models/OfferLookup";
import ICrudService from "./iCrudService";
import { Logger } from "pino";
import Log from "../globals/logger";

export default class OfferLookupsService implements ICrudService<OfferLookup> {
  
  private logger: Logger;

  constructor() {
    this.logger = Log.getInstance().getLogger();
  }

  public async insert(model: any): Promise<OfferLookup> {
    try {
      const result = await OfferLookup.create(model);
      return result;
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }

  public async get(model: any): Promise<OfferLookup[]> {
    try {
      const list:OfferLookup[] = await OfferLookup.findAll(model) as OfferLookup[];
      return list;
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }

  public async update(id:number, model: any): Promise<OfferLookup> {
    try {
      const foundModel: OfferLookup = await this.getById(id);
      if (!foundModel) {
        throw new Error('not found');
      }
      await foundModel.update(model);
      return foundModel;
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }

  public async getById(id: number): Promise<OfferLookup> {
    try {
      const model: OfferLookup = await OfferLookup.findById(id) as OfferLookup;
      return model;
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }

  public async delete(id: number): Promise<Boolean> {
    try {
      const foundModel: OfferLookup = await this.getById(id);
      await foundModel.destroy();
      return true;
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }

}
