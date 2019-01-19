import ITimestampSequence from "./iTimestampSequence";

interface ICoin extends ITimestampSequence {
  name: string;
  symbol: string;
  logoUrl: string;
}
export default ICoin;
