const bcryptjs = require("bcryptjs");
const jose = require("jose");

const encryptedPassword = async (password = "") => {
  const salt = await bcryptjs.genSalt(10);
  const hash = await bcryptjs.hash(password, salt);
  return hash;
};

const comparePassword = async (password, hash) => {
  const isMatch = await bcryptjs.compare(password, hash);
  return isMatch;
};

const getJwtSecret = () => {
  const secret = new TextEncoder().encode(process.env.JWT_SECRET);
  return secret;
};

const generateJwt = async (payload, expireIn = "5m") => {
  const secret = getJwtSecret();

  const jwt = await new jose.SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(expireIn)
    .sign(secret);

  return jwt;
};

module.exports = {
  encryptedPassword,
  comparePassword,
  getJwtSecret,
  generateJwt,
};
