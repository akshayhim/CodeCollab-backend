import { DataTypes } from "sequelize";
import { sequelize } from "../config/db.mjs"; // Import your configured Sequelize instance

const Project = sequelize.define("Project", {
  projectId: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  projectName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

// Define associations with other models (if applicable)
Project.associate = (models) => {
  // Example association: Project belongs to a User
  Project.belongsTo(models.user, {
    foreignKey: {
      name: "userId",
      allowNull: false, // Projects must have an associated user
    },
    onDelete: "CASCADE", // If a user is deleted, also delete associated projects
  });

  Project.hasMany(models.file, {
    foreignKey: "projectId",
    onDelete: "CASCADE",
  });
  // Add more associations as needed
};

// ... any additional model configurations or hooks can be added here

export default Project;
