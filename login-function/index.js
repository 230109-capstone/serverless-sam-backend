const { login } = require('./login-service')
const LoginError = require('./login-errors')
const { retrieveUserByUsername } = require("./login-dao")



exports.handler = async (event) => {

  try {
    const parsedBody = JSON.parse(event.body);
    const username = parsedBody.username;
    const password = parsedBody.password;

    if (!username || !password) {
      throw new Error('Username and/or password not provided');
    }

    const token = await login(username, password);
    const user = await retrieveUserByUsername(username);
    delete user.Item.password;

    return ({
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "OPTIONS, POST",
        "Access-Control-Allow-headers": "Content-Type, X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token", 
    },
      body: JSON.stringify({
        "message": "Login successful",
        "token": token,
        user
      }),
    });

  } catch (err) {
    if (err instanceof LoginError) {
      return ({
        statusCode: 400,
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "OPTIONS, POST",
          "Access-Control-Allow-headers": "Content-Type, X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token",
      },
        body: JSON.stringify({
          "errors": err.errors
        })
      })
    }

    return {
      statusCode: 500,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "OPTIONS, POST",
        "Access-Control-Allow-headers": "Content-Type, X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token", 
    },
      body: JSON.stringify({
        "errors": [err.message]
      })
    }
  }

}
