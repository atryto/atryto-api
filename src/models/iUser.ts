import ITimestamp from "./iTimestamp";

interface IUser extends ITimestamp {
  id?: number;
  email?: string;
  username?: string;
  password?: string;
  profilepictureurl?: string;
}
export default IUser;
