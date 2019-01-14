import ITimestamp from "./iTimestamp";

interface IOfferLookup extends ITimestamp {
  citySlug?: string;
  sourceCoinSymbol?: string;
  destCoinSymbol?: string;
}
export default IOfferLookup;