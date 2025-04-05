import path from "path";
import { Sequelize } from "sequelize";
import dotenv from "dotenv";

dotenv.config();

const dbConfig = {
  pass: process.env.DB_PASSWORD,
  host: process.env.DB_HOST,
  name: process.env.DB_NAME,
  port: process.env.DB_PORT,
}
const {pass, name, host, port} = dbConfig;

const DATABASE_URL = `postgresql://postgres:${pass}@${host}:${port}/${name}`;

const sequelize = new Sequelize(DATABASE_URL, {
  dialect: "postgres",
  logging: false,
});

export default sequelize;
