import ITimestamp from "./iTimestamp";

interface IUserRate extends ITimestamp {
  id?: number;
  userid?: number;
  rateruserid?: number;
  grade?: number;
}
export default IUserRate;
