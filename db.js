import { Sequelize } from 'sequelize';
import dotenv from 'dotenv'
dotenv.config()


const {
  DATABASE, USER_NAME, PASSWORD, HOSTDIGITAL, DATABASE_SITEGROUND, USER_NAME_SITEGROUND, HOST_SITEGROUND, PASSWORD_SITEGROUND,
} = process.env;

const sitegroundDB = new Sequelize(DATABASE_SITEGROUND, USER_NAME_SITEGROUND, PASSWORD_SITEGROUND, {
  host: HOST_SITEGROUND,
  dialect: 'mysql',
  logging: false,
  ssl: true,
  dialectOptions: {
    connectTimeout: 60000,
    ssl: {
      sslmode: 'REQUIRED',
      require: true,
      rejectUnauthorized: false,
    },
  },
  pool: {
    max: 20,
    min: 0,
    acquire: 60000,
    idle: 10000,
  },
});

export { sitegroundDB };