import config from "../config/config";
import Db from "../globals/db";

export default class ResetDb {
  
  public static async run() {
    const db = Db.getInstance().getSequelize();
    await db.query(`DELETE FROM ${config.database.schema}.userrates`);
    await db.query(`DELETE FROM ${config.database.schema}.offers`);
    await db.query(`DELETE FROM ${config.database.schema }.offerlookups`);
    await db.query(`DELETE FROM ${config.database.schema}.exchanges`);
    await db.query(`DELETE FROM ${config.database.schema}.users`);
    return true;
  }
}
