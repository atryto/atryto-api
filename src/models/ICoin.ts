import ITimestamp from "./iTimestamp";

interface ICoin extends ITimestamp {
  name: string;
  symbol: string;
  logourl: string;
}
export default ICoin;
