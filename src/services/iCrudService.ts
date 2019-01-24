import { Model } from "sequelize-typescript";

export default interface ICrudService<T extends Model<T>> {
  insert(where: any): Promise<T>;
  get(where: any, limit: number, offset: number, attributes: string[], order: any): Promise<T[]>;
  update(id:number, model: any): Promise<T>;
  getById(id: number): Promise<T>;
  delete(id: number): Promise<Boolean>;
}