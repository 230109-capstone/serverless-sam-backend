const AWS = require('aws-sdk');

AWS.config.update({
  region: 'us-east-1',
});

const documentClient = new AWS.DynamoDB.DocumentClient();

// get all the reimbursements from the database
function retrieveAllReimbursements() {
  return documentClient
    .scan({
      TableName: process.env.REIMBURSEMENTS_TABLE_NAME,
    })
    .promise();
}

// get all the reimbursements that belong to the user from the database
function retrieveAllReimbursementsByUsername(username) {
  return documentClient
    .query({
      TableName: process.env.REIMBURSEMENTS_TABLE_NAME,
      IndexName: 'submitterIndex',
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

module.exports = {
  retrieveAllReimbursements,
  retrieveAllReimbursementsByUsername,
};
