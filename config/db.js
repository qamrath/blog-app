// db.js

import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';

dotenv.config();

const sequelize = new Sequelize({
    dialect: 'mysql',
    host: 'localhost',
    port: 3306, // MySQL port
    username: 'root',
    password: 'root',
    database: 'user',
  });

async function testDatabaseConnection() {
  try {
    await sequelize.authenticate();
    console.log('Database connection has been established successfully.');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
}

export default sequelize;
