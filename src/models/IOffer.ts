import ITimestamp from "./iTimestamp";

interface IOffer extends ITimestamp {
  userId?: number;
  citySlug?: string;
  sourceCoinSymbol?: string;
  destCoinSymbol?: string;
  wantedPricePerUnit?: number;
  minAmount?: number;
  amount?: number;
}
export default IOffer;
