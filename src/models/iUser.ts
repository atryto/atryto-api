import ITimestampSequence from "./iTimestampSequence";

interface IUser extends ITimestampSequence {
  email?: string;
  username?: string;
  password?: string;
  profilePictureUrl?: string;
  citySlug: string;
  allowOnlineTransactions: boolean;
}
export default IUser;
