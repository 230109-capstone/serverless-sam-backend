const AWS = require('aws-sdk');
const { register } = require('./register-handler-service')

AWS.config.update({
    region: 'us-east-1'
});

exports.handler = async (event) => {
    try{
        const parsedBody = JSON.parse(event.body);
        const username = parsedBody.username;
        const password = parsedBody.password;

        if (!username || !password) {
            throw new Error('Username and/or password not provided');
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
                "errors": [ err.message ]
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