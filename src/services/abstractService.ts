import config from "../config/config";
import IUser from "../models/iUser";
import UserDAO from "../daos/userDAO";
import * as jwt from "jsonwebtoken";
import * as bcrypt from "bcrypt";
import AbstractCrudDAO from "../daos/abstractCrudDAO";

const logger: any = require("pino")({ level: config.logLevel });

export default class AbstractService<T> {
  protected dao: AbstractCrudDAO<T>;

  constructor(dao:AbstractCrudDAO<T>) {
    this.dao = dao;
  }

  public async insert(model: T) {
    try {
      const result = await this.dao.insert(model);
      return result;
    } catch (error) {
      logger.error(error);
      throw error;
    }
  }

  public async get(model: T): Promise<T[]> {
    try {
      const list:T[] = await this.dao.get(model) as T[];
      return list;
    } catch (error) {
      logger.error(error);
      throw error;
    }
  }

  public async update(id:number, model: T): Promise<Boolean> {
    try {
      await this.dao.update(id, model);
      return true;
    } catch (error) {
      logger.error(error);
      throw error;
    }
  }

  public async getById(id: number): Promise<T> {
    try {
      const model: T = await this.dao.getById(id) as T;
      return model;
    } catch (error) {
      logger.error(error);
      throw error;
    }
  }

  public async delete(id: number): Promise<boolean> {
    try {
      const removed: boolean = await this.dao.delete(id);
      return removed;
    } catch (error) {
      logger.error(error);
      throw error;
    }
  }

}
