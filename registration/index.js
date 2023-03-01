const bcrypt = require('bcrypt');
const AWS = require('aws-sdk');
const documentClient = new AWS.DynamoDB.DocumentClient();
const jwtUtil = require('./jwtUtil');

exports.handler = async (event) => {
    try{
        const parsedBody = JSON.parse(event.body);
        const username = parsedBody.username;
        const password = parsedBody.password;
        
    } catch(err){

    }
}