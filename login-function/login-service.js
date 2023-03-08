// login-service.js
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const {retrieveUserByUsername} = require('./login-dao');
const LoginError = require('./login-errors')

function createToken(username, role) {
  return jwt.sign({
    username: username,
    role: role
  }, process.env.JWT_SIGNING_SECRET)
}

async function login(username, password) {
    const data = await retrieveUserByUsername(username);
  
    const errors = [];
    if (!data.Item) {
      errors.push("Invalid username");
    } else if (!(await bcrypt.compare(password, data.Item.password))) {
      errors.push("Invalid password");
    }
  
    if (errors.length > 0) {
      throw new LoginError(errors);
    }
  
    return createToken(data.Item.username, data.Item.role);
}

module.exports = {
	login
}