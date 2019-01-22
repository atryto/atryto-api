import { DataType, Table, Column, Model, Unique, PrimaryKey, CreatedAt, UpdatedAt, DeletedAt } from 'sequelize-typescript';

@Table({
  timestamps: true,
  paranoid: true,
  tableName: 'cities'
})
class City extends Model<City> {

  @PrimaryKey
  @Column(DataType.STRING)
  slug: string;

  @Unique
  @Column(DataType.STRING)
  name: string;

  @Column(DataType.STRING)
  country: string;

  @CreatedAt
  @Column(DataType.DATE)
  createdAt: Date;

  @UpdatedAt
  @Column(DataType.DATE)
  updatedAt: Date;

  @DeletedAt
  @Column(DataType.DATE)
  deletedAt: Date;

}

export default City;