import ITimestampSequence from "./iTimestampSequence";

interface ICity extends ITimestampSequence {
  slug: string;
  name: string;
  country: string;
}
export default ICity;
