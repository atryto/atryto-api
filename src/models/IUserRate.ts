import ITimestamp from "./iTimestamp";

interface IUserRate extends ITimestamp {
  userid?: number;
  rateruserid?: number;
  grade?: number;
}
export default IUserRate;
