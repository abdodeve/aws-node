const base64 = require("base-64");

module.exports.decode = token => {
  return base64.decode(token.split(".")[1]);
};
