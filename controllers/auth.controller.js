const db = require("../models");
const User = db.users;
const jwt = require("jsonwebtoken");
const passportJWT = require("passport-jwt");
const bcrypt = require("bcrypt");
const saltRounds = 10;
let ExtractJwt = passportJWT.ExtractJwt;
const constants = require("../constants");

require("dotenv").config();
const secretOrKey = process.env.SECRETORKEY;

let jwtOptions = {};
jwtOptions.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
jwtOptions.secretOrKey = secretOrKey;

const getUser = async (obj) => {
  return await User.findOne({
    where: obj,
  });
};

const createToken = (payload, secretOrKey, expiresIn) => {
  const token = jwt.sign(payload, secretOrKey, {
    expiresIn,
  });
  return token;
};

exports.login = async (req, res) => {
  try {
    const { u_email, u_password } = req.body;
    let user = await getUser({ u_email });
    const match = await bcrypt.compareSync(u_password, user.u_password);
    if (match) {
      let payload = { u_id: user.u_id, u_email };
      let token = createToken(payload, jwtOptions.secretOrKey, "1d");
      // req.session.userId = payload.u_id;
      res.json({
        result: constants.kResultOk,
        message: "ok",
        u_email,
        token: token,
      });
      // res.json({ user, payload });
    } else {
      res.status(401).json({
        result: constants.kResultNok,
        message: "Password is incorrect",
      });
    }
  } catch (error) {
    res
      .status(401)
      .json({ result: constants.kResultNok, message: "No such user found" });
  }
};

exports.register = async (req, res) => {
  try {
    const { u_email, u_password } = req.body;
    const salt = bcrypt.genSaltSync(saltRounds);
    const hash = bcrypt.hashSync(u_password, salt);
    const result = await User.create({ u_email, u_password: hash });
    res.json({ u_email: result.u_email, msg: "account created successfully" });
  } catch (error) {
    res
      .status(403)
      .json({ result: constants.kResultNok, message: JSON.stringify(error) });
  }
};
