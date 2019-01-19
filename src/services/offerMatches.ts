import AbstractService from "./abstractService";
import OfferMatchDAO from "../daos/offerMatchDAO";
import IOfferMatch from "../models/IOfferMatch";

export default class OfferMatchesService extends AbstractService<IOfferMatch> {
  
  constructor() {
    super(new OfferMatchDAO());
  }

}
