import { DataType, Table, Column, Model, ForeignKey, DeletedAt, UpdatedAt, CreatedAt } from 'sequelize-typescript';
import City from './City';
import Coin from './Coin';

@Table({
  timestamps: true,
  paranoid: true,
  tableName: 'offerLookups',
})
class OfferLookup extends Model<OfferLookup> {
  
  @ForeignKey(() => City)
  @Column(DataType.STRING)
  citySlug: string;
  
  @ForeignKey(() => Coin)
  @Column(DataType.STRING)
  sourceCoinSymbol: string;
  
  @ForeignKey(() => Coin)
  @Column(DataType.STRING)
  destCoinSymbol: string;

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

export default OfferLookup;