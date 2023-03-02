const AWS = require('aws-sdk');

AWS.config.update({
  region: "us-east-1"
});

const documentClient = new AWS.DynamoDB.DocumentClient();

function addReimbursement(reimbId, amount, description, status, submitter) {
  return documentClient.put({
    TableName: process.env.REIMBURSEMENTS_TABLE_NAME,
    Item: {
      id: reimbId,
      amount: amount,
      description: description,
      status: status,
      submitter: submitter
    }
  }).promise();
}

const s3Client = new AWS.S3();

function addReimbursementImage(reimbId, imageBuffer, extension) {
    return s3Client.putObject({
        Bucket: process.env.RECEIPTS_BUCKET_NAME,
        Key: `${reimbId}.${extension}`,
        Body: imageBuffer
    }).promise();
}

module.exports = {
  addReimbursementImage,
  addReimbursement
}