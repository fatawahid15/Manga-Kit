let bcrypt = require("bcryptjs");

const hash = (password) => {
  let salt = bcrypt.genSaltSync(10);
  let hash = bcrypt.hashSync(password, salt);
  return hash;
};

const compare = (password, hashPass) => {
  let hashed = bcrypt.compareSync(password, hashPass);
  return hashed;
};

module.exports = { hash, compare };
