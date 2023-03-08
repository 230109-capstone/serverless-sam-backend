const AWS = require('aws-sdk');
const jwt = require('jsonwebtoken');
const { JsonWebTokenError } = require('jsonwebtoken');
const AuthorizationError = require('./errors');

const { authorizeEmployeeOrFinanceManager, retrieveReimbursements } = require('./service');

exports.handler = async (event) => {
  try {
    console.log(event.headers.Authorization);
    const payload = await authorizeEmployeeOrFinanceManager(event.headers.Authorization);
    const reimbursements = await retrieveReimbursements(payload);

    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Headers':
          'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'OPTIONS,POST,GET',
      },
      body: JSON.stringify({
        message: 'Reimbursements successfully retrieved',
        data: reimbursements,
      }),
    };
  } catch (error) {
    if (error instanceof JsonWebTokenError) {
      return {
        statusCode: 401,
        headers: {
          'Access-Control-Allow-Headers':
            'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token',
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'OPTIONS,POST,GET',
        },
        body: JSON.stringify({
          message: error.message,
        }),
      };
    }

    if (error instanceof AuthorizationError) {
      return {
        statusCode: 401,
        headers: {
          'Access-Control-Allow-Headers':
            'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token',
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'OPTIONS,POST,GET',
        },
        body: JSON.stringify({
          message: error.message,
        }),
      };
    }

    return {
      statusCode: 500,
      headers: {
        'Access-Control-Allow-Headers':
          'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'OPTIONS,POST,GET',
      },
      body: JSON.stringify({
        message: error.message,
      }),
    };
  }
};
