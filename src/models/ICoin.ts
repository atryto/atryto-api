import ITimestamp from "./iTimestamp";

interface ICoin extends ITimestamp {
  id: number;
  name: string;
  symbol: string;
  logourl: string;
}
export default ICoin;
