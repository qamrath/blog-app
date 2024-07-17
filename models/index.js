import sequelize from '../config/db.js'; 
import User from '../models/user.js';
import { Post } from '../models/post.js';

// Define associations
User.hasMany(Post, { foreignKey: 'userId' });
Post.belongsTo(User, { foreignKey: 'userId' });

// Export models and Sequelize instance
export { sequelize, User, Post };
