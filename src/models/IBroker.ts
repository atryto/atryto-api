import ITimestamp from "./iTimestamp";

interface IBroker extends ITimestamp {
  id: number;
  userid: number;
  website: string;
}
export default IBroker;
