import ITimestamp from "./iTimestamp";

interface ICoin extends ITimestamp {
  name: string;
  symbol: string;
  logoUrl: string;
}
export default ICoin;
