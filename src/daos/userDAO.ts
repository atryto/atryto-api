import config from "../config/config";
import IUser from "../models/iUser";
import * as bcrypt from "bcrypt";
import AbstractCrudDAO from "./abstractCrudDAO";

export default class UserDAO extends AbstractCrudDAO<IUser> {
  
  constructor() {
    super('users');
  }

  public async insert<IUser>(user) {
    const salt = await bcrypt.genSalt(config.passwordSalt);
    user.password = await bcrypt.hash(user.password, salt);
    return super.insert(user);
  }

}
