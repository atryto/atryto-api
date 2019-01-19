import AbstractCrudDAO from "./abstractCrudDAO";
import IOffer from "../models/IOffer";
import IOfferLookup from "../models/IOfferLookup";
import IOfferMatch from "../models/IOfferMatch";

export default class OfferMatchDAO extends AbstractCrudDAO<IOfferMatch> {
  
  constructor() {
    super('offerMatches');
  }

}
