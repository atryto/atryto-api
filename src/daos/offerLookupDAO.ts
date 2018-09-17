import AbstractCrudDAO from "./abstractCrudDAO";
import IOffer from "../models/IOffer";
import IOfferLookup from "../models/IOfferLookup";

export default class OfferLookupDAO extends AbstractCrudDAO<IOfferLookup> {
  
  constructor() {
    super('offerlookups');
  }

}
