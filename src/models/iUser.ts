import ITimestamp from "./iTimestamp";

interface IUser extends ITimestamp {
  id?: number;
  email?: string;
  username?: string;
  password?: string;
  profilepictureurl?: string;
  cityslug: string;
  allowonlinetransactions: boolean;
}
export default IUser;
