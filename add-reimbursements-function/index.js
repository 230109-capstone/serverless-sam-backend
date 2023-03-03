const { JsonWebTokenError } = require('jsonwebtoken');
const ReimbursementError = require('./errors');
const AuthorizationError = require('./errors');

const authService = require('./service');
const reimbService = require('./service');

exports.handler = async (event) => {
    const bodyObject = JSON.parse(event.body);

    try {
      const payload = await authService.authorizeEmployee(event.headers.authorization);
  
      await reimbService.addReimbursement(payload.username, bodyObject);
  
      return response = {
        'statusCode': 200,
        headers: {
          'Access-Control-Allow-Origin' : '*',
          'Access-Control-Allow-Headers':'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token',
          "Access-Control-Allow-Methods": "GET, POST, OPTIONS"
        },
        'body': JSON.stringify({
            message: 'Reimbursement successfully added',
        })
      }
    } catch(err) {
      if (err instanceof JsonWebTokenError) {
        return {
            statusCode: 401,
            headers: {
              'Access-Control-Allow-Origin' : '*',
              'Access-Control-Allow-Headers':'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token',
              "Access-Control-Allow-Methods": "GET, POST, OPTIONS"
            },
            body: JSON.stringify({
                "message": err.message
            })
        }
      }
  
      if (err instanceof AuthorizationError) {
        return {
            statusCode: 401,
              headers: {
                'Access-Control-Allow-Origin' : '*',
                'Access-Control-Allow-Headers':'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token',
                "Access-Control-Allow-Methods": "GET, POST, OPTIONS"
              },
            body: JSON.stringify({
                "message": err.message
            })
        }
      }
  
      if (err instanceof ReimbursementError) {
        return {
            statusCode: 400,
            headers: {
              'Access-Control-Allow-Origin' : '*',
              'Access-Control-Allow-Headers':'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token',
              "Access-Control-Allow-Methods": "GET, POST, OPTIONS"
            },
            body: JSON.stringify({
                "message": err.message
            })
        }
      }

      return {
        statusCode: 500,
        headers: {
          'Access-Control-Allow-Origin' : '*',
          'Access-Control-Allow-Headers':'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token',
          "Access-Control-Allow-Methods": "GET, POST, OPTIONS"
        },
        body: JSON.stringify({
            "message": err.message
        })
      }
    }
};
