import path from "path";
import { Sequelize } from "sequelize";
import dotenv from "dotenv";

dotenv.config();

const dbConfig = {
  pass: process.env.DB_PASSWORD,
  host: process.env.DB_HOST,
  name: process.env.DB_NAME,
  port: process.env.DB_PORT,
  platform: process.env.DB_PLATFORM,
}
const {pass, name, host, port, platform} = dbConfig;

const DATABASE_URL = `postgresql://${platform}:${pass}@${host}/${name}`;

const sequelize = new Sequelize(DATABASE_URL, {
  dialect: "postgres",
  logging: false,
});

export default sequelize;
