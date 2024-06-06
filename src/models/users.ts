import { DataTypes, Model } from 'sequelize';
import  sequelize  from '../config/database';
import * as bcrypt from 'bcryptjs';

export enum UserRole {
  ADMIN = 'admin',
  REGULAR = 'regular',
  STAFF = 'staff',
}

interface UserAttributes {
  id?: number;
  first_name: string;
  last_name: string;
  email: string;
  password: string;
  role: UserRole;
  isVerified?: boolean;
}

class User extends Model<UserAttributes> implements UserAttributes {
  public id!: number;
  public first_name!: string;
  public last_name!: string;
  public email!: string;
  public password!: string;
  public role!: UserRole;
  public isVerified!: boolean;

  public async comparePassword(password: string): Promise<boolean> {
    return bcrypt.compare(password, this.password);
  }
}

User.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    first_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    last_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    isVerified: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    role: {
      type: DataTypes.ENUM(...Object.values(UserRole)),
      allowNull: false,
    },
  },
  {
    tableName: 'users',
    sequelize,
    hooks: {
      beforeCreate: async (user: User) => {
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(user.password, salt);
      },
    },
  }
);

export { User };
