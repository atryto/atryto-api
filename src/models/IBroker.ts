import ITimestamp from "./iTimestamp";

interface IBroker extends ITimestamp {
  userid: number;
  website: string;
}
export default IBroker;
