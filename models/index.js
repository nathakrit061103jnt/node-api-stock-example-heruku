const dbConfig = require("../configs/db.config");
const URI =
  "postgres://fsjifywvfraors:db7c1a43e608aafa926a221f762755aede62a9e9192356a6352cdfc2c1b37f05@ec2-54-208-139-247.compute-1.amazonaws.com:5432/dehgbcc4cv2opo";
const Sequelize = require("sequelize");
// const sequelize = new Sequelize(dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD, {
//   host: dbConfig.HOST,
//   dialect: dbConfig.dialect,
//   operatorsAliases: false,
//   ssl: {
//     rejectUnauthorized: false,
//   },
//   pool: {
//     max: dbConfig.pool.max,
//     min: dbConfig.pool.min,
//     acquire: dbConfig.pool.acquire,
//     idle: dbConfig.pool.idle,
//   },
// });

const sequelize = new Sequelize(URI, {
  pool: {
    max: dbConfig.pool.max,
    min: dbConfig.pool.min,
    acquire: dbConfig.pool.acquire,
    idle: dbConfig.pool.idle,
  },
});

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

// check the databse connection
sequelize
  .authenticate()
  .then(() => console.log("Connection has been established successfully."))
  .catch((err) => console.error("Unable to connect to the database:", err));

db.products = require("./product.model")(sequelize, Sequelize);
db.users = require("./user.model")(sequelize, Sequelize);

module.exports = db;
