import { Model } from "sequelize-typescript";

export default interface ICrudService<T extends Model<T>> {
  insert(model: any): Promise<T>;
  get(model: any): Promise<T[]>;
  update(id:number, model: any): Promise<T>;
  getById(id: number): Promise<T>;
  delete(id: number): Promise<Boolean>;
}
