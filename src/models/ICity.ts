import ITimestamp from "./iTimestamp";

interface ICity extends ITimestamp {
  slug: string;
  name: string;
  country: string;
}
export default ICity;
