const AWS = require('aws-sdk');
const { register } = require('./register-handler-service')
const RegistrationError = require('./errors/registration-error')

AWS.config.update({
    region: 'us-east-1'
});

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
            headers: {
              "Access-Control-Allow-Origin": "*",
              "Access-Control-Allow-Methods": "OPTIONS, POST",
              "Access-Control-Allow-headers": "Content-Type", 
          },
            body: JSON.stringify({
                "message": "User successfully registered"
            })
        };
    } catch(err){
        if (err instanceof RegistrationError) {
            return {
              statusCode: 400,
              headers: {
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Methods": "OPTIONS, POST",
                "Access-Control-Allow-headers": "Content-Type", 
            },
              body: JSON.stringify({
                "errors": [ err.message ]
              })
            }
        }

        return{
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