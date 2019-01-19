import ITimestamp from "./iTimestamp";

interface IOfferMatch extends ITimestamp {
  userId?: number;
  offerId?: number;
}
export default IOfferMatch;
