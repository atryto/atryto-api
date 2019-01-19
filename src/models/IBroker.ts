import ITimestampSequence from "./iTimestampSequence";

interface IBroker extends ITimestampSequence {
  userId: number;
  website: string;
}
export default IBroker;
