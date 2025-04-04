import path from "path";
import { Sequelize } from "sequelize";


const DB_PATH = path.join("data", "database.sqlite");

const sequelize = new Sequelize({
  dialect: "sqlite",
  storage: DB_PATH,
  logging: false,
});

export default sequelize;
