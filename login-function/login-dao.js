const AWS = require('aws-sdk');

AWS.config.update({
  region: "us-east-1"
});

const documentClient = new AWS.DynamoDB.DocumentClient();
const table = process.env.USERS_TABLE;

async function retrieveUserByUsername(username) {
    return documentClient.get({
        TableName: table,
        Key: {
            username: username
        }
    }).promise();
}

module.exports = {retrieveUserByUsername}