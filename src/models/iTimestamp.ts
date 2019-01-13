import ISequence from "./ISequence";

interface ITimestamp extends ISequence {
  createdat?: number;
  updatedat?: number;
}
export default ITimestamp;
