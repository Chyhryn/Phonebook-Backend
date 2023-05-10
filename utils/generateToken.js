const jwt = require("jsonwebtoken");
require("dotenv").config();

const { SECRET_KEY } = process.env;

/**
 * Creates a token for user.
 *
 * @param {*} payload - token payload
 * @returns token
 */
const generateToken = (payload) => {
  return jwt.sign(payload, SECRET_KEY, { expiresIn: "1h" });
};

module.exports = generateToken;
