const RegistrationError = require('./errors/registration-error');
const bcrypt = require('bcryptjs');
const { retrieveUserByUsername, addUser } = require('./register-handler-dao');

async function register(username, password) {
    const pattern = /[\s~`!@#$%\^&*+=\-\[\]\\';,/{}|\\":<>\?()\._]/g;
    const errorMessages = [];
    // Check if username meets validation requirements
    if (!(username.length >= 8 && username.length <= 20)) {
      errorMessages.push('Username must be between 8 and 20 (inclusive)');
    }
  
    // Check if password meets validation requirements
    if (!(password.length >= 8 && password.length <= 20)) {
      errorMessages.push('Password must be between 8 and 20 (inclusive)');
    }
  
    // check if password contains special character
    if (!(pattern.test(password))){
      errorMessages.push('Password must contain a special character');
    }
    
    // Check if username is already taken
    const data = await retrieveUserByUsername(username);
    if (data.Item) {
      errorMessages.push('Username is already taken');
    }
  
    if (errorMessages.length > 0) {
      throw new RegistrationError(errorMessages);
    }
  
    // Add user to DB
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);
  
    await addUser({
      "username": username,
      "password": hash,
      "role": "finance_manager"
    });
}

module.exports = {
    register
}