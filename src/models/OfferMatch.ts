import { DataType, Table, Column, Model, ForeignKey, PrimaryKey, DeletedAt, UpdatedAt, CreatedAt, AutoIncrement } from 'sequelize-typescript';
import User from './User';
import Offer from './Offer';

@Table({
  timestamps: true,
  paranoid: true,
  tableName: 'offerMatches',
})
class OfferMatch extends Model<OfferMatch> {
  
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER)
  id: number;

  @ForeignKey(() => User)
  @Column(DataType.INTEGER)
  userId: number;
  
  @ForeignKey(() => Offer)
  @Column(DataType.INTEGER)
  offerId: number;

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

export default OfferMatch;