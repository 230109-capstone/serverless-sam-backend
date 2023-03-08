// login-service.js
const bcrypt = require('bcryptjs');
const {retrieveUserByUsername} = require('./login-dao');
const LoginError = require('./login-errors')
const {createToken} = require('./login-util')


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