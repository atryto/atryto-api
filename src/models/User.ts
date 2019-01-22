import { DataType, Table, Column, Model, Default, AutoIncrement, PrimaryKey, AllowNull, Unique, DeletedAt, UpdatedAt, CreatedAt } from 'sequelize-typescript';

@Table({
  timestamps: true,
  paranoid: true,
  tableName: 'users',
})
class User extends Model<User> {
  
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER)
  id: number;
  
  @AllowNull(false)
  @Unique
  @Column(DataType.STRING)
  email: string;

  @AllowNull(false)
  @Unique
  @Column(DataType.STRING)
  username: string;

  @AllowNull(false)
  @Column(DataType.STRING)
  password: string;

  @Column(DataType.STRING)
  profilePictureUrl: string;

  @AllowNull(false)
  @Column(DataType.STRING)
  citySlug: string;

  @Default(true)
  @Column(DataType.BOOLEAN)
  allowOnlineTransactions: boolean;

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

export default User;