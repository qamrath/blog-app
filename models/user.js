import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/db.js';


class User extends Model {}

User.init({
  // model attributes
  username: {
    type: DataTypes.STRING,
    allowNull: false
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false
  }
}, {
  sequelize, 
  modelName: 'User' 
});

export default User;
