const AWS = require('aws-sdk');
const jwt = require('jsonwebtoken');
const { JsonWebTokenError } = require('jsonwebtoken');
const AuthorizationError = require('./errors');

const { authorizeEmployeeOrFinanceManager, retrieveReimbursements } = require('./service');

exports.handler = async (event) => {
  try {
    console.log(event);
    const payload = await authorizeEmployeeOrFinanceManager(event.headers.authorization);
    const reimbursements = await retrieveReimbursements(payload);

    return {
      statusCode: 200,
      body: JSON.stringify({
        message: 'Reimbursements successfully retrieved',
        data: reimbursements,
      }),
    };
  } catch (error) {
    if (err instanceof JsonWebTokenError) {
      return {
        statusCode: 401,
        body: JSON.stringify({
          message: err.message,
        }),
      };
    }

    if (err instanceof AuthorizationError) {
      return {
        statusCode: 401,
        body: JSON.stringify({
          message: err.errors,
        }),
      };
    }

    return {
      statusCode: 500,
      body: JSON.stringify({
        errors: [err.message],
      }),
    };
  }
};
