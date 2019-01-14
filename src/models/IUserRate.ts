import ITimestamp from "./iTimestamp";

interface IUserRate extends ITimestamp {
  userId?: number;
  raterUserId?: number;
  grade?: number;
}
export default IUserRate;
