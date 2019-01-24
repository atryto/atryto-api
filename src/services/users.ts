import config from "../config/config";
import * as jwt from "jsonwebtoken";
import * as bcrypt from "bcrypt";
import User from "../models/User";
import ICrudService from "./iCrudService";
import { Logger } from "pino";
import * as Boom from "boom";
import Log from "../globals/logger";
import Mailer from "../globals/mailer";
import IEmail from "../models/interfaces/IEmail";

const logger: any = require("pino")({ level: config.logLevel });

export default class UsersService implements ICrudService<User> {
  
  private logger: Logger;
  private mailer: Mailer;

  constructor() {
    this.logger = Log.getInstance().getLogger();
    this.mailer = Mailer.getInstance();
  }
  
  public async insert(model: any): Promise<User> {
    try {
      const salt = await bcrypt.genSalt(config.passwordSalt);
      model.password = await bcrypt.hash(model.password, salt);
      const { username, email, ...defaults } = model;
      const foundOrCreate = await User.findOrCreate({ where: { username, email }, defaults: defaults });
      // sequelize returns an array, first item is the object, second is a boolean
      // if this boolean is true it means it was created
      if (foundOrCreate.length > 1 && !foundOrCreate[1]) {
        throw Boom.forbidden('User already exists');
      }
      const { password, ...user } = (foundOrCreate[0]).toJSON();
      const data: IEmail = {
        from: config.emailSender,
        to: user.email,
        subject: 'Welcome to Atryto',
        html: `Hello ${user.username}, Welcome to Atryto, we are an <a href="https://github.com/atryto">open source</a> project aiming to help people avoiding fees and connecting.`
      };
      this.mailer.sendEmail(data);
      return User.build(user);
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }

  public async get(where: any, limit: number = null, offset: number = null,
    attributes: string[] = null, order: any[] = null): Promise<User[]> {
    try {
      const query: any = {};
      if (where) query.where = where;
      if (limit) query.limit = limit;
      if (offset) query.offset = offset;
      if (attributes) query.attributes = attributes;

      const users = await User.findAll(query);
      return users.map(user => {
        const { password, ...res } = user.toJSON();
        return User.build(res);
      });
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }

  public async getById(id: number): Promise<User> {
    try {
      const user: User = await User.findById(id) as User;
      delete user.password;
      return user;
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }

  public async login(user: any): Promise<String> {
    try {
      const where: any = {};

      if (user.email) where.email = user.email;
      if (user.username) where.username = user.username;

      const dbUser: User = await User.findOne({ where });
      const checkPassword = await bcrypt.compare(user.password, dbUser.password);
      if (!checkPassword) {
        throw Boom.unauthorized('Invalid password.');
      }
      const {password, ...modUser} = dbUser.toJSON();
      // create a token
      const token = await jwt.sign({ ...modUser }, config.tokenSecret, {
        expiresIn: 2 * 86400 // expires in 48 hours
      });
      return token;
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }

  public async update(id:number, model: any): Promise<User> {
    const foundModel: User = await this.getById(id);
    if (!foundModel) {
      throw Boom.notFound('not found');
    }
    if ('email' in model) {
      throw Boom.forbidden('email cannot be modified');
    }
    if ('username' in model) {
      throw Boom.forbidden('username cannot be modified');
    }
    if ('password' in model) {
      const salt = await bcrypt.genSalt(config.passwordSalt);
      model.password = await bcrypt.hash(model.password, salt);
    }
    await foundModel.update(model);
    return foundModel;
  }

  public async delete(id: number): Promise<Boolean> {
    try {
      const foundModel: User = await this.getById(id);
      await foundModel.destroy();
      return true;
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }

}
