import { DataTypes } from "sequelize";
import { sequelize } from "../config/db.mjs"; // Import your configured Sequelize instance

const File = sequelize.define("File", {
  fileId: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  fileName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  fileContent: {
    type: DataTypes.TEXT, // Use TEXT data type for storing file content as text (including code)
    allowNull: true, // Adjust based on your requirements
  },
  // ... other file attributes
});

// Define associations with other models (if applicable)
File.associate = (models) => {
  // Example association: File belongs to a Project
  File.belongsTo(models.Project, {
    foreignKey: {
      name: "projectId",
      allowNull: false, // Files must be associated with a project
    },
    onDelete: "CASCADE", // If a project is deleted, also delete associated files
  });

  // Add more associations as needed
};

// ... any additional model configurations or hooks can be added here

export default File;
