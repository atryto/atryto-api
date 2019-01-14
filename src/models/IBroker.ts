import ITimestamp from "./iTimestamp";

interface IBroker extends ITimestamp {
  userId: number;
  website: string;
}
export default IBroker;
