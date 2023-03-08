const { login } = require('./login-service')
const LoginError = require('./login-errors')



exports.handler = async (event) => {

  try {
    const parsedBody = JSON.parse(event.body);
    const username = parsedBody.username;
    const password = parsedBody.password;

    if (!username || !password) {
      throw new Error('Username and/or password not provided');
    }

    const token = await login(username, password);

    return ({
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "OPTIONS, POST",
        "Access-Control-Allow-headers": "Content-Type", 
    },
      body: JSON.stringify({
        "message": "Login successful",
        "token": token
      }),
    });
  } catch (err) {
    if (err instanceof LoginError) {
      return ({
        statusCode: 400,
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "OPTIONS, POST",
          "Access-Control-Allow-headers": "Content-Type", 
      },
        body: JSON.stringify({
          "errors": [err.message]
        })
      })
    }

    return {
      statusCode: 500,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "OPTIONS, POST",
        "Access-Control-Allow-headers": "Content-Type", 
    },
      body: JSON.stringify({
        "errors": [err.message]
      })
    }
  }

}
