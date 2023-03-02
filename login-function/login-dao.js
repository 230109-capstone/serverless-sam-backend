const AWS = require('aws-sdk');

AWS.config.update({
  region: "us-east-1"
});

const documentClient = new AWS.DynamoDB.DocumentClient();

async function retrieveUserByUsername(username) {
    return documentClient.get({
        TableName: 'users',
        Key: {
            username: username
        }
    }).promise();
}

module.exports = {retrieveUserByUsername}