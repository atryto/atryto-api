import ISequence from "./ISequence";

interface ITimestamp extends ISequence {
  createdAt?: number;
  updatedAt?: number;
  deletedAt?: number;
}
export default ITimestamp;
