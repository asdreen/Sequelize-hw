import { Sequelize } from "sequelize";

const { PG_DB, PG_HOST, PG_PORT, PG_PASSWORD, PG_USER } = process.env;

const sequelize = new Sequelize(PG_DB, PG_USER, PG_PASSWORD, {
  host: PG_HOST,
  port: PG_PORT,
  dialect: "postgres",
});

export const pgConnect = async () => {
  try {
    await sequelize.authenticate();
    console.log("Succesfully connnected to Pg");
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};

export const syncModels = async () => {
  try {
    await sequelize.sync({ alter: true });
    console.log("all tables are synced");
  } catch (error) {
    console.log(error);
  }
};

export default sequelize;
