import { Sequelize } from "sequelize";
import dotenv from "dotenv";

dotenv.config();

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: "postgres",
  }
);

const connectToDatabase = async () => {
  try {
    await sequelize.authenticate();
    await sequelize.sync();
    console.log("Connected to PostgreSQL database");
  } catch (error) {
    console.error("Unable to connect to the database:", error);
  }
};

// Call the connectToDatabase function to authenticate when this module is imported
connectToDatabase();

// Export the sequelize instance directly, without the default keyword
export { sequelize };
