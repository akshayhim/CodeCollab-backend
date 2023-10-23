import { DataTypes } from "sequelize";
import { sequelize } from "../config/db.mjs"; // Import your configured Sequelize instance

const User = sequelize.define("User", {
  userId: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  username: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true,
    },
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  // ... other user attributes
});

User.associate = (models) => {
  // Example association: User has many Projects
  User.hasMany(models.project, {
    foreignKey: "userId", // 'userId' will be the foreign key in the 'Project' table
    onDelete: "CASCADE", // If a user is deleted, also delete associated projects
  });
};

export default User;
