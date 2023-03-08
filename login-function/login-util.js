const jwt = require('jsonwebtoken');

function createToken(username, role) {
    return jwt.sign({
      username: username,
      role: role
    }, process.env.JWT_SIGNING_SECRET)
  }

  module.exports = {createToken}