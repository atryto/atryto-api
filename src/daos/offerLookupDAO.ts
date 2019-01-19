import AbstractCrudDAO from "./abstractCrudDAO";
import IOfferLookup from "../models/IOfferLookup";

export default class OfferLookupDAO extends AbstractCrudDAO<IOfferLookup> {
  
  constructor() {
    super('offerlookups');
  }

}
