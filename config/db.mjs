import { Sequelize } from "sequelize";

const sequelize = new Sequelize("collab_code_editor", "postgres", "password", {
  host: "localhost",
  port: 5432,
  dialect: "postgres",
});

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
