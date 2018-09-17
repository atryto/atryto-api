import ITimestamp from "./iTimestamp";

interface ICity extends ITimestamp {
  id: number;
  slug: string;
  name: string;
  country: string;
}
export default ICity;
