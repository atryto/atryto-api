import ITimestampSequence from "./iTimestampSequence";

interface IOfferLookup extends ITimestampSequence {
  citySlug?: string;
  sourceCoinSymbol?: string;
  destCoinSymbol?: string;
}
export default IOfferLookup;