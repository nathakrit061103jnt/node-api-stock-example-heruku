module.exports = (sequelize, Sequelize) => {
  const Product = sequelize.define("products", {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    p_name: {
      type: Sequelize.STRING(50),
      // unique: true,
      allowNull: false,
    },
    p_price: {
      type: Sequelize.INTEGER,
      allowNull: true,
    },
    p_count: {
      type: Sequelize.INTEGER,
      allowNull: true,
    },
    p_image: {
      type: Sequelize.STRING(),
      unique: true,
      allowNull: false,
    },
    createdAt: {
      type: Sequelize.DATE,
    },
    updatedAt: {
      type: Sequelize.DATE,
    },
  });

  return Product;
};
