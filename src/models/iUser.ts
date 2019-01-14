import ITimestamp from "./iTimestamp";

interface IUser extends ITimestamp {
  email?: string;
  username?: string;
  password?: string;
  profilePictureUrl?: string;
  citySlug: string;
  allowOnlineTransactions: boolean;
}
export default IUser;
