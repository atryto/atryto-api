import config from "../config/config";
import IUser from "../models/iUser";
import UserDAO from "../daos/userDAO";
import * as jwt from "jsonwebtoken";
import * as bcrypt from "bcrypt";

const logger: any = require("pino")({ level: config.logLevel });

export default class UsersService {
  private dao: UserDAO;

  constructor() {
    this.dao = new UserDAO();
  }

  public async insert(user: IUser) {
    try {
      const result = await this.dao.insert(user);
      return result;
    } catch (error) {
      logger.error(error);
      throw error;
    }
  }

  public async get(user: IUser): Promise<IUser[]> {
    try {
      const users = await this.dao.get(user);
      return users.map(user => {
        delete user.password;
        return user;
      });
    } catch (error) {
      logger.error(error);
      throw error;
    }
  }

  public async getById(id): Promise<IUser> {
    try {
      const user: IUser = await this.dao.getById(id);
      delete user.password;
      return user;
    } catch (error) {
      logger.error(error);
      throw error;
    }
  }

  public async login(user: IUser): Promise<String> {
    try {
      const query = {} as IUser;

      if (user.email) query.email = user.email;
      if (user.username) query.username = user.username;

      const users: IUser[] = await this.dao.get(query);
      if (!users || users.length <= 0) {
        throw Error('User not found');
      }
      const dbUser: IUser = users[0];
      const checkPassword = await bcrypt.compare(user.password, dbUser.password);
      if (!checkPassword) {
        throw Error('Password invalid');
      }
      const {password, ...modUser} = dbUser;
      // create a token
      const token = await jwt.sign({ ...modUser }, config.tokenSecret, {
        expiresIn: 2 * 86400 // expires in 48 hours
      });
      return token;
    } catch (error) {
      logger.error(error);
      throw error;
    }
  }

}
