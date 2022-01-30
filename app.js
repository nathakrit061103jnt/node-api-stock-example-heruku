const createError = require("http-errors");
const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");

const cors = require("cors");

const authRouter = require("./routes/auth.routes");
const productsRouter = require("./routes/product.routes");

const session = require("express-session");
const passport = require("passport");

const app = express();

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.use(express.static(__dirname + "/uploads/"));
app.set("view engine", "jade");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
// app.use(express.static(path.join(__dirname, "public")));

app.use(
  session({
    secret: process.env.SECRETORKEY,
    cookie: { maxAge: 60000 },
  })
); // session secret
app.use(passport.initialize());
// app.use(passport.session()); // persistent login sessions

app.use(cors());

//Models
const models = require("./models");

//load passport strategies
require("./configs/passport/passport")(models);

//Sync Database
models.sequelize
  .sync()
  .then(() => {
    console.log("Nice! Database looks fine");
  })
  .catch((err) => {
    console.log(err, "Something went wrong with the Database Update!");
  });

app.use("/auth", authRouter);
app.use(
  "/products",
  passport.authenticate("jwt", { session: false }),
  productsRouter
);

// catch 404 and forward to error handler
app.use((req, res, next) => {
  next(createError(404));
});

// error handler
app.use((err, req, res, next) => {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

const port = process.env.PORT || 8090;

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});

module.exports = app;
