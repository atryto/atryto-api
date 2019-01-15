import config from "../config/config";
import * as moment from 'moment';
import Db from "../globals/db";
import ISequence from "../models/ISequence";

export default class AbstractCrudDAO<T extends ISequence> {

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
    const setParams = Object.keys(model).map((key) => {return "SET @"+key+ "=?;"}).join("");
    await this.db.queryWrite(setParams, Object.values(model));
    const execute = "EXECUTE stmt USING " + Object.keys(model).map(key => "@" + key) + ";";
    return this.db.queryWrite(execute, []);
  }

  public async insert(model: T) {
    return this.insertQuery(model, this.dbTableName);
  }

  public async update(id: number, model: T) {
    const foundModel = await this.getById(id);
    if (!foundModel) {
      throw Error('Not found');
    }
    let updateQuery = ` UPDATE ${config.database.schema}.${this.dbTableName} `;
    const valuesToUpdate = [];
    updateQuery += 'SET ' + Object.keys(model).map((key) => {
      if (foundModel[key] && model[key] != foundModel[key]) {
        let valueToUpdate = model[key];
        // modifying date to be mysql formatted
        if (moment(model[key], 'YYYY-MM-DDTHH:mm:ss.sssZ').isValid()) {
          valueToUpdate = moment(model[key]).format('YYYY-MM-DD HH:MM:SS');
        }
        valuesToUpdate.push(valueToUpdate);
        return ` ${key}=?,`;
      }
      return '';
    }).join('');
    updateQuery = updateQuery.replace(/,\s*$/, '');
    updateQuery += ` WHERE ID = ${id};`;
    return this.db.queryWrite(updateQuery, valuesToUpdate);
  }

  public async get<T>(model: T): Promise<T[]> {
    let getQuery = ` SELECT * FROM ${config.database.schema}.${this.dbTableName} `;
    if (model && Object.keys(model).length > 0) {
      getQuery += ' WHERE 1=1 ';
      for (const key in model) {
        getQuery += ` AND ${key}=? `;
      } 
    }
    getQuery += ';';
    return this.db.queryWrite(getQuery, model ? Object.values(model) : []);
  } 
    

  public async getById(id: number): Promise<T> {
    const result: T[] = await this.db.queryWrite(`SELECT * FROM ${config.database.schema}.${this.dbTableName} WHERE id=?;`, [id]);
    return (result && result.length > 0) ? result[0] : null;
  }

  public async delete(id: number): Promise<boolean> {
    const result: T[] = await this.db.queryWrite(`DELETE FROM ${config.database.schema}.${this.dbTableName} WHERE id=?;`, [id]);
    return true;
  }

}
