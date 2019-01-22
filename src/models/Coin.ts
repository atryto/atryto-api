import { DataType, Table, Column, Model, Unique, PrimaryKey, CreatedAt, UpdatedAt, DeletedAt } from 'sequelize-typescript';

@Table({
  timestamps: true,
  paranoid: true,
  tableName: 'coins'
})
class Coin extends Model<Coin> {
  
  @PrimaryKey
  @Unique
  @Column(DataType.STRING)
  symbol: string;

  @Unique
  @Column(DataType.STRING)
  name: string;

  @Column(DataType.STRING)
  type: string;

  @Column(DataType.STRING)
  logoUrl: string;

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

export default Coin;