import { DataType, Table, Column, Model, AutoIncrement, PrimaryKey, ForeignKey, AllowNull, UpdatedAt, CreatedAt, DeletedAt } from 'sequelize-typescript';
import User from './User';
import City from './City';
import Coin from './Coin';

@Table({
  timestamps: true,
  paranoid: true,
  tableName: 'offers'
})
class Offer extends Model<Offer> {

  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER)
  id: number;
  
  @ForeignKey(() => User)
  @Column(DataType.INTEGER)
  userId: number;
  
  @ForeignKey(() => City)
  @Column(DataType.STRING)
  citySlug: string;
  
  @ForeignKey(() => Coin)
  @Column(DataType.STRING)
  sourceCoinSymbol: string;
  
  @ForeignKey(() => Coin)
  @Column(DataType.STRING)
  destCoinSymbol: string;
  
  @Column(DataType.INTEGER)
  wantedPricePerUnit: number;
  
  @Column(DataType.INTEGER)
  minAmount: number;
  
  @AllowNull(false)
  @Column(DataType.INTEGER)
  amount: number;

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

export default Offer;