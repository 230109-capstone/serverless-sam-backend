const AWS = require('aws-sdk');

AWS.config.update({
    region: 'us-east-1'
});

const documentClient = new AWS.DynamoDB.DocumentClient();

const table = process.env.USERS_TABLE;

function retrieveUserByUsername(username) {
    return documentClient.get({
      TableName: table,
      Key: {
        username: username
      }
    }).promise();
}

function addUser(userObj) {
    return documentClient.put({
      TableName: table,
      Item: userObj
    }).promise();
}

module.exports = {
    retrieveUserByUsername,
    addUser
}