import ITimestampSequence from "./iTimestampSequence";

interface IOffer extends ITimestampSequence {
  userId?: number;
  citySlug?: string;
  sourceCoinSymbol?: string;
  destCoinSymbol?: string;
  wantedPricePerUnit?: number;
  minAmount?: number;
  amount?: number;
}
export default IOffer;
