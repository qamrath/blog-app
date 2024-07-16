import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/db.js';


class Post extends Model {}

Post.init({
  // Define model attributes
  title: {
    type: DataTypes.STRING,
    allowNull: false
  },
  content: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false
  }
}, {
  sequelize, // Pass the sequelize instance
  modelName: 'Post' // Choose the model name
});

export {Post};// Named export

