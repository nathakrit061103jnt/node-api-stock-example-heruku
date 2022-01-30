module.exports = (sequelize, Sequelize) => {
  const User = sequelize.define("users", {
    u_id: {
      type: Sequelize.INTEGER,
      field: "u_id",
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    u_email: {
      type: Sequelize.STRING(50),
      isEmail: true,
      unique: true,
      allowNull: false,
    },
    u_password: {
      type: Sequelize.STRING(),
      allowNull: false,
    },
    createdAt: {
      type: Sequelize.DATE,
    },
    updatedAt: {
      type: Sequelize.DATE,
    },
  });

  return User;
};
