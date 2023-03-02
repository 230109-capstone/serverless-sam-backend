const bcrypt = require('bcryptjs');
const AWS = require('aws-sdk');

AWS.config.update({
    region: 'us-east-1'
});

const documentClient = new AWS.DynamoDB.DocumentClient();


const table = process.env.USERS_TABLE;
console.log(`users table is ${table}`);

class RegistrationError extends Error {
    constructor(errors) {
      super('Registration Error');
      this.errors = errors;
    }
}

exports.handler = async (event) => {
    try{
        const parsedBody = JSON.parse(event.body);
        const username = parsedBody.username;
        const password = parsedBody.password;

        if (!username || !password) {
            throw new RegistrationError('Username and/or password not provided');
        }

        await register(username, password);

        return {
            statusCode: 200,
            body: JSON.stringify({
                "message": "User successfully registered"
            })
        };
    } catch(err){
        if (err instanceof RegistrationError) {
            return {
              statusCode: 400,
              body: JSON.stringify({
                "errors": err.errors
              })
            }
        }
        
        return{
          statusCode: 500,
          body: JSON.stringify({
            "errors": [err.message]
          })
        }
      }
}

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
   /* const data = await retrieveUserByUsername(username);
    if (data.Item) {
      errorMessages.push('Username is already taken');
    }*/
  
    if (errorMessages.length > 0) {
      throw new RegistrationError(errorMessages);
    }
  
    // Add user to DB
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);
  
    await addUser({
      "username": username,
      "password": hash,
      "role": "employee"
    });
}

function retrieveUserByUsername(username) {
    return documentClient.get({
      TableName: table,
      Key: {
        username: username
      }
    }).promise();
}

function addUser(userObj) {
    return documentClient.put({
      TableName: table,
      Item: userObj
    }).promise();
}