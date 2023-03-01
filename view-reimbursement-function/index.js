const AWS = require('aws-sdk');
const jwt = require('jsonwebtoken');
const { JsonWebTokenError } = require('jsonwebtoken');

AWS.config.update({
  region: 'us-east-1',
});

const documentClient = new AWS.DynamoDB.DocumentClient();

exports.handler = async (event) => {
  try {
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
          errors: [err.message],
        }),
      };
    }

    if (err instanceof AuthorizationError) {
      return {
        statusCode: 401,
        body: JSON.stringify({
          errors: err.errors,
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

async function authorizeEmployeeOrFinanceManager(authorizationHeader) {
  if (!authorizationHeader) {
    throw new JsonWebTokenError('Token not provided');
  }

  const token = authorizationHeader.split(' ')[1];
  const payload = await verifyTokenAndReturnPayload(token);

  if (!(payload.role == 'employee' || payload.role == 'finance_manager')) {
    throw new AuthorizationError(['Employee or Finance manager role required']);
  }

  return payload;
}

function verifyTokenAndReturnPayload(token) {
  return new Promise((resolve, reject) => {
    jwt.verify(token, process.env.JWT_SIGNING_SECRET, (err, data) => {
      if (err) {
        reject(err);
      } else {
        resolve(data);
      }
    });
  });
}

async function retrieveReimbursements(payload) {
  if (payload.role === 'finance_manager') {
    const data = await retrieveAllReimbursements();
    return data.Items;
  } else if (payload.role === 'employee') {
    const data = await retrieveAllReimbursementsByUsername(payload.username);
    return data.Items;
  }
}

function retrieveAllReimbursements() {
  return documentClient
    .scan({
      TableName: 'reimbursements',
    })
    .promise();
}

function retrieveAllReimbursementsByUsername(username) {
  return documentClient
    .query({
      TableName: 'reimbursements',
      IndexName: 'submitter-index',
      KeyConditionExpression: '#s = :user',
      ExpressionAttributeNames: {
        '#s': 'submitter',
      },
      ExpressionAttributeValues: {
        ':user': username,
      },
    })
    .promise();
}

class AuthorizationError extends Error {
  constructor(errors) {
    super('Authorization Error');
    this.errors = errors;
  }
}
