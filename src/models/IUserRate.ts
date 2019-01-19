import ITimestampSequence from "./iTimestampSequence";

interface IUserRate extends ITimestampSequence {
  userId?: number;
  raterUserId?: number;
  grade?: number;
}
export default IUserRate;
