const AWS = require('aws-sdk');
const documentClient = new AWS.DynamoDB.DocumentClient();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

class LoginError extends Error {
    constructor(errors) {
      super("Login Error");
      this.errors = errors;
    }
  }


exports.handler = async (event, context) => {
    const path = event.pathParameters;
    const body = JSON.parse(event.body);

    try {
        const username = event.body.username;
        const password = event.body.password;

        if (!username || !password) {
            throw new Error('Username and/or password not provided');
        }

        const token = await login(username, password);

        return res.send({
            "message": "Login successful",
            "token": token
        });
    } catch (err) {
        if (err instanceof LoginError) {
            return res.status(400).send({
                "errors": err.errors
            })
        }

        return res.status(500).send({
            "errors": [err.message]
        });
    }
}


//Login function
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

//create JWT upon login
function createToken(username, role) {
    return jwt.sign({
        username: username,
        role: role
    }, process.env.JWT_SIGNING_SECRET)
}

//DynamoDB query for user
async function retrieveUserByUsername(username) {
    return documentClient.get({
        TableName: 'users',
        Key: {
            username: username
        }
    }).promise();
}

module.exports = {retrieveUserByUsername, login};