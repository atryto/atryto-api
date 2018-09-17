import * as MySQL from "mysql";
import config from "../config/config";
const logger: any = require("pino")({ level: config.logLevel });
import Db from "../globals/db";

export default class AbstractCrudDAO<T> {

  protected db: any;
  protected dbTableName: String;

  constructor(dbTableName) {
    this.db = Db.getInstance();
    this.dbTableName = dbTableName;
  }

  protected async insertQuery(model: any, tableName: String) {
    const prepare = `PREPARE stmt FROM 'INSERT INTO ${config.database.schema}.${tableName} ` +
                      `(${Object.keys(model)}) values (${Object.keys(model).map(t => "?")})';`;
    await this.db.queryWrite(prepare, []);
    const setParams =Object.keys(model).map((key) => {return "SET @"+key+ "=?;"}).join("");
    await this.db.queryWrite(setParams, Object.values(model));
    const execute = "EXECUTE stmt USING " + Object.keys(model).map(key => "@" + key) + ";";
    return this.db.queryWrite(execute, []);
  }

  public async insert<T>(model: T) {
    return this.insertQuery(model, this.dbTableName);
  }

  public async getById<T>(id: number): Promise<T> {
    const result: T[] = await this.db.queryWrite(`SELECT * FROM ${config.database.schema}.${this.dbTableName} WHERE id=?;`, [id]);
    return (result && result.length > 0) ? result[0] : null;
  }

  public async get<T>(model: T): Promise<T[]> {
    let getQuery = `SELECT * FROM ${config.database.schema}.${this.dbTableName} `;
    if (model && Object.keys(model).length > 0) {
      getQuery += 'WHERE 1=1 ';
      for (const key in model) {
        getQuery += `AND ${key}=?`;
      } 
    }
    getQuery += ';';
    return this.db.queryWrite(getQuery, model ? Object.values(model) : []);
  }

}
