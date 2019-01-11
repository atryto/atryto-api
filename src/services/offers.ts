import IOffer from "../models/IOffer";
import OfferDAO from "../daos/offerDAO";
import AbstractService from "./abstractService";

export default class OffersService extends AbstractService<IOffer> {
  
  constructor() {
    super(new OfferDAO());
  }

}
