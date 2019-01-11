import IOfferLookup from "../models/IOfferLookup";
import OfferLookupDAO from "../daos/offerLookupDAO";
import AbstractService from "./abstractService";

export default class OfferLookupsService extends AbstractService<IOfferLookup> {
  
  constructor() {
    super(new OfferLookupDAO());
  }

}
